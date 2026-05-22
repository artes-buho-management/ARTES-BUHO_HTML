"""
download-thumbnails.py — Descarga thumbnails de TODAS las fotos y logos de Drive
para analisis visual. Usa lh3.googleusercontent.com (no necesita API).
"""
import json, os, re, urllib.request, sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CATALOG = BASE / "config" / "photos-catalog.json"
CACHE_DIR = BASE / "cache"
THUMB_DIRECTO = CACHE_DIR / "thumb_directo"
THUMB_ESTUDIO = CACHE_DIR / "thumb_estudio"

def download_thumb(file_id, dest_path, width=300):
    """Descarga thumbnail via lh3 (funciona sin auth para archivos compartidos)"""
    if dest_path.exists():
        return True  # Ya descargada
    url = f"https://lh3.googleusercontent.com/d/{file_id}=w{width}"
    try:
        resp = urllib.request.urlopen(url, timeout=15)
        with open(str(dest_path), 'wb') as f:
            f.write(resp.read())
        return True
    except Exception as e:
        print(f"  ERROR {file_id}: {e}")
        return False

def main():
    if not CATALOG.exists():
        print("ERROR: No existe photos-catalog.json. Ejecuta primero: python scripts/drive-sync.py")
        sys.exit(1)
    with open(CATALOG, encoding="utf-8") as f:
        catalog = json.load(f)

    # Crear carpetas
    THUMB_DIRECTO.mkdir(parents=True, exist_ok=True)
    THUMB_ESTUDIO.mkdir(parents=True, exist_ok=True)

    # Descargar directo
    directo = catalog.get("directo", [])
    print(f"Descargando {len(directo)} thumbnails DIRECTO...")
    ok_d = 0
    for i, foto in enumerate(directo):
        fid = foto["id"]
        name = foto.get("name", f"photo_{i}").replace("/", "_").replace("\\", "_")
        ext = ".jpg" if not name.lower().endswith(".heic") else ".jpg"
        dest = THUMB_DIRECTO / f"d_{i:03d}_{fid}{ext}"
        if download_thumb(fid, dest):
            ok_d += 1
        if (i + 1) % 50 == 0:
            print(f"  {i+1}/{len(directo)} descargadas...")
    print(f"  DIRECTO: {ok_d}/{len(directo)} OK")

    # Descargar estudio
    estudio = catalog.get("estudio", [])
    print(f"Descargando {len(estudio)} thumbnails ESTUDIO...")
    ok_e = 0
    for i, foto in enumerate(estudio):
        fid = foto["id"]
        dest = THUMB_ESTUDIO / f"e_{i:03d}_{fid}.jpg"
        if download_thumb(fid, dest):
            ok_e += 1
        if (i + 1) % 50 == 0:
            print(f"  {i+1}/{len(estudio)} descargadas...")
    print(f"  ESTUDIO: {ok_e}/{len(estudio)} OK")

    print(f"\nTotal: {ok_d + ok_e}/{len(directo) + len(estudio)} thumbnails descargadas")

if __name__ == "__main__":
    main()
