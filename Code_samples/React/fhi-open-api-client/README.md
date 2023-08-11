# FHI Open API Client


## Description
To install dependencies run:
```npm install```


## Notes
Must be run in secure mode (https):

PowerShell:
``` ($env:NODE_OPTIONS='--openssl-legacy-provider') -and ($env:HTTPS = "true") -and (npm start)```
cmd:
```set NODE_OPTIONS=--openssl-legacy-provider && set HTTPS=true && npm start```
bash:
```NODE_OPTIONS=--openssl-legacy-provider HTTPS=true npm start```
