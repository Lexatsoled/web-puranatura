 = Start-Process npm -ArgumentList 'run','preview','--','--host','127.0.0.1','--strictPort','--port','4173' -RedirectStandardOutput 'preview.log' -RedirectStandardError 'preview.err' -NoNewWindow -PassThru
Start-Sleep -Seconds 10
Stop-Process -Id .Id -Force
