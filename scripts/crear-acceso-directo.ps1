# ============================================================
#  crear-acceso-directo.ps1
#  Crea un acceso directo en el Escritorio con el logo de ARTES BUHO
#  Desarrollado por RUBEN COTON para ARTES BUHO MANAGEMENT
# ============================================================

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$target      = Join-Path $projectRoot "ARTES-BUHO_EmailBuilder.bat"
$iconPath    = Join-Path $projectRoot "assets\img\app-icon.ico"
$desktop     = [Environment]::GetFolderPath("Desktop")
$shortcut    = Join-Path $desktop "ARTES BUHO - Email Builder.lnk"

# Usa icono de ARTES BUHO si existe, si no avisa
if (-not (Test-Path $iconPath)) {
    Write-Warning "Icono no encontrado en $iconPath"
    Write-Warning "Guarda el logo como assets\img\app-icon.ico (formato ICO) para el acceso directo."
}

$wsh = New-Object -ComObject WScript.Shell
$sc = $wsh.CreateShortcut($shortcut)
$sc.TargetPath       = $target
$sc.WorkingDirectory = $projectRoot
$sc.WindowStyle      = 7   # minimizado
$sc.Description      = "ARTES BUHO - Email Builder (desarrollado por RUBEN COTON)"
if (Test-Path $iconPath) {
    $sc.IconLocation = "$iconPath,0"
}
$sc.Save()

Write-Host ""
Write-Host "[OK] Acceso directo creado en:" -ForegroundColor Green
Write-Host "     $shortcut"
Write-Host ""
Write-Host "Doble click en el escritorio para abrir la app." -ForegroundColor Cyan
