# ============================================================
#  convertir-logo-a-ico.ps1
#  Convierte assets\img\artes-buho-logo.png a app-icon.ico
#  (necesario para el acceso directo del escritorio)
# ============================================================

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$png = Join-Path $projectRoot "assets\img\artes-buho-logo.png"
$ico = Join-Path $projectRoot "assets\img\app-icon.ico"

if (-not (Test-Path $png)) {
    Write-Error "No existe $png. Guarda primero el logo como artes-buho-logo.png en assets\img\"
    exit 1
}

# Cargar PNG
$bitmap = [System.Drawing.Bitmap]::FromFile($png)

# Redimensionar a 256x256 para icono
$size = 256
$resized = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($resized)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.DrawImage($bitmap, 0, 0, $size, $size)
$g.Dispose()

# Convertir a icono
$hIcon = $resized.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = [System.IO.File]::Create($ico)
$icon.Save($fs)
$fs.Close()
$bitmap.Dispose()
$resized.Dispose()

Write-Host "[OK] Icono generado: $ico" -ForegroundColor Green
Write-Host "Ahora puedes ejecutar scripts\crear-acceso-directo.ps1" -ForegroundColor Cyan
