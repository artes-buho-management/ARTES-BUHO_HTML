# ARTES-BUHO_HTML

Aplicacion local de email marketing con plantillas HTML para la matriz **ARTES BUHO MANAGEMENT**.

## Objetivo

Crear, gestionar y enviar correos HTML para campanas de la empresa matriz ARTES BUHO.
Plantillas reutilizables, previsualizacion local, listas para enviar desde Gmail (cuenta booking@artesbuhomanagement.com).

## Marca

- Colores corporativos: **rojo**, **amarillo**, **blanco**
- Logo: `assets/img/artes-buho-logo.png`
- Nombre de la app: **ARTES BUHO — Email Builder**

## Estructura

```
ARTES-BUHO_HTML/
├── README.md
├── index.html             # App principal (SPA)
├── server.js              # Servidor local (puerto 8090)
├── ARTES-BUHO_EmailBuilder.bat  # Launcher Windows
├── templates/             # Plantillas HTML de correos
│   └── base.html          # Plantilla base reutilizable
├── assets/
│   └── img/               # Logos, iconos, imagenes
├── campaigns/             # Correos finales listos para enviar
├── config/                # Catalogos (fotos, logos, carpetas Drive)
├── cache/                 # Imagenes procesadas
├── preview/               # Vista previa de plantillas
└── scripts/               # Utilidades Python (sync Drive, recortes)
```

## Uso

1. Doble click en `ARTES-BUHO_EmailBuilder.bat` (o acceso directo del escritorio).
2. Abre `http://localhost:8090` en el navegador.
3. Rellenar audiencia + objetivo → la IA genera la campana.
4. Previsualizar y crear borrador en Gmail.

## Stack

- HTML + CSS inline (compatibilidad email)
- Node.js (servidor local)
- Python (sync Google Drive)
- IA local: Ollama + Qwen 2.5 14B
- Ejecucion 100% local

## Diferencias con RUBEN-COTON_HTML (matriz original)

Este proyecto es un fork adaptado a la marca ARTES BUHO. Comparte arquitectura con el proyecto hermano `RUBEN-COTON_HTML` pero:

- Marca, colores, logo y textos diferentes.
- Cuenta de envio: `booking@artesbuhomanagement.com`.
- Dominio y firma corporativa ARTES BUHO.

## Credito

Desarrollado por **RUBEN COTON** para ARTES BUHO MANAGEMENT.

## Flujo git seguro

Si `git push` falla por politica local:

```
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\elrub\Desktop\CARPETA CODEX\03_SCRIPTS_UTILIDAD\publicar_desde_local.ps1" -RepoPath "C:\Users\elrub\Desktop\CARPETA CODEX\01_PROYECTOS\ARTES-BUHO_HTML" -Remote origin -Branch main
```
