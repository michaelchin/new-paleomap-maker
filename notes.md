`nvm use 18`

`npm run dev`

http://localhost:3000

### Deploy

- `ssh -i ~/.ssh/gplates-app-server-key.pem ubuntu@130.56.247.160`
- `cd /home/ubuntu/new-paleomap-maker`
- `npm run build`
- `npm run start`
