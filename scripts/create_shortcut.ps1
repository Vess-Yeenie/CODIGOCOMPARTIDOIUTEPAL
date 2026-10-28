$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $DesktopPath "Sistema IUTEPAL.lnk"
$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Intentar usar Microsoft Edge o Chrome en modo App
$Browser = "msedge.exe"
$Args = '--app="http://172.16.0.4:3000"'

# Ruta del icono
$IconPath = Join-Path (Split-Path -Parent $CurrentDir) "STRUCTURE\IMG\iutepal.ico"

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $Browser
$Shortcut.Arguments = $Args
if (Test-Path $IconPath) {
    $Shortcut.IconLocation = "$IconPath,0"
}
$Shortcut.Description = "Sistema de Trabajos de Grado IUTEPAL"
$Shortcut.Save()

Write-Host "[EXITO] Acceso directo creado en el Escritorio con icono de IUTEPAL!" -ForegroundColor Green

