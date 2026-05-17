# Stop Redis in WSL, kill backend (port 3000) and frontend (port 5173)
#wsl sudo service redis-server stop; 
#wsl sudo service redis-server start; 
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; 
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue };


#wsl redis-server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\hrasheed\Dropbox\github-repos\projects\agent-dev-team\islamic-learning-platform\backend'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\hrasheed\Dropbox\github-repos\projects\agent-dev-team\islamic-learning-platform\frontend'; npm run dev"
#Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\hrasheed\Dropbox\github-repos\projects\agent-dev-team\islamic-learning-platform\directus'; ./start-directus.bat"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\hrasheed\Dropbox\github-repos\projects\agent-dev-team\islamic-learning-platform\directus'; docker-compose up -d" 
#URL: http://localhost:8055
#Email: admin@example.com
#Password: AdminPassword123!