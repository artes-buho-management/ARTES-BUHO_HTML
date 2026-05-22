"""
crop-photos.py — Recorta las mejores fotos a 600x320px para el email
Recorte inteligente: centra en la zona de acción (top/center/bottom)
"""
import json, os, sys, urllib.request
from pathlib import Path
from PIL import Image

BASE = Path(__file__).resolve().parent.parent
CROPPED_DIR = BASE / "cache" / "cropped"
TARGET_W, TARGET_H = 600, 320

def crop_photo(file_id, crop_position="center", output_name=None):
    """Descarga foto de Drive y la recorta a 600x320 con posición inteligente"""
    CROPPED_DIR.mkdir(parents=True, exist_ok=True)
    out_path = CROPPED_DIR / (output_name or f"{file_id}.jpg")

    if out_path.exists():
        print(f"  SKIP: {out_path.name} (ya existe)")
        return str(out_path)

    # Descargar versión grande (w800 para buena calidad de recorte)
    url = f"https://lh3.googleusercontent.com/d/{file_id}=w800"
    tmp_path = CROPPED_DIR / f"_tmp_{file_id}.jpg"

    try:
        resp = urllib.request.urlopen(url, timeout=15)
        with open(str(tmp_path), 'wb') as f:
            f.write(resp.read())
    except Exception as e:
        print(f"  ERROR descargando {file_id}: {e}")
        return None

    try:
        img = Image.open(str(tmp_path))
        w, h = img.size

        # Calcular ratio para que el ancho sea 600px
        ratio = TARGET_W / w
        new_h = int(h * ratio)
        img = img.resize((TARGET_W, new_h), Image.LANCZOS)

        # Recortar verticalmente según posición
        if new_h <= TARGET_H:
            # Imagen más baja que el target, centrar
            result = Image.new('RGB', (TARGET_W, TARGET_H), (0, 0, 0))
            offset = (TARGET_H - new_h) // 2
            result.paste(img, (0, offset))
        else:
            # Recortar según posición
            if crop_position == "top":
                box = (0, 0, TARGET_W, TARGET_H)
            elif crop_position == "bottom":
                box = (0, new_h - TARGET_H, TARGET_W, new_h)
            else:  # center
                top = (new_h - TARGET_H) // 2
                box = (0, top, TARGET_W, top + TARGET_H)
            result = img.crop(box)

        result.save(str(out_path), "JPEG", quality=90)
        print(f"  OK: {out_path.name} ({w}x{h} -> {TARGET_W}x{TARGET_H}, crop={crop_position})")

    except Exception as e:
        print(f"  ERROR procesando {file_id}: {e}")
        return None
    finally:
        if tmp_path.exists():
            tmp_path.unlink()

    return str(out_path)

def main():
    # Leer lista de fotos seleccionadas desde stdin o archivo
    selected_file = BASE / "config" / "selected-photos.json"
    if not selected_file.exists():
        print("ERROR: No existe config/selected-photos.json")
        print("Crea el archivo con la lista de fotos seleccionadas")
        sys.exit(1)

    with open(selected_file, encoding="utf-8") as f:
        photos = json.load(f)

    print(f"Recortando {len(photos)} fotos a {TARGET_W}x{TARGET_H}px...")
    results = []
    for i, photo in enumerate(photos):
        fid = photo["id"]
        crop = photo.get("crop", "center")
        name = f"email_{i:02d}_{fid}.jpg"
        path = crop_photo(fid, crop, name)
        if path:
            results.append({**photo, "cropped_path": path, "cropped_name": name})

    # Guardar resultado
    with open(BASE / "config" / "cropped-photos.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\nRecortadas: {len(results)}/{len(photos)}")
    print(f"Guardado en: config/cropped-photos.json")

if __name__ == "__main__":
    main()
