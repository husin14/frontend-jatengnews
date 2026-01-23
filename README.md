cara deploy ke docker local:
docker build -t frontend-tvku:1 .
docker build -f Dockerfile2 -t api-tvku-laravel:1 .
docker run -d --env-file .env --name frontend-tvku-1 --restart unless-stopped -p 8123:8080 frontend-tvku:1