' ============================================================
' Inicia el servidor IUTEPAL de forma silenciosa en segundo plano
' sin mostrar ninguna ventana de consola que se pueda cerrar por error.
' Para detenerlo, usa el archivo detener_servidor.bat
' ============================================================

Set objFSO = CreateObject("Scripting.FileSystemObject")
strCurrentDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
strBatPath = strCurrentDir & "\iniciar_servidor.bat"

Set objShell = CreateObject("WScript.Shell")
' El parametro 0 oculta la ventana completamente
objShell.Run "cmd /c """ & strBatPath & """", 0, False

MsgBox "El Servidor IUTEPAL se ha iniciado en segundo plano." & vbCrLf & vbCrLf & _
       "URL: http://172.16.0.4:3000" & vbCrLf & vbCrLf & _
       "Seguirá funcionando mientras esta computadora esté encendida." & vbCrLf & _
       "Para detenerlo cuando quieras, ejecuta 'detener_servidor.bat'.", _
       vbInformation, "Servidor IUTEPAL Activo"

