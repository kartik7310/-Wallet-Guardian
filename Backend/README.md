  

 Wallet Guardian Backend (Docker Setup)

This project sets up the Wallet Guardian  backend using Node.js ,prisma and MySQL , containerized with Docker.



 Docker Installation Steps

 1. Build the backend image


docker build -t wallet-backend .

 2. Run MySQL container

docker run -d --name mysql-container -e MYSQL\_ROOT\_PASSWORD=rootpass -p 3306:3306 mysql:8

docker run -dp 8080:8080 --name wallet-backend --env-file .env wallet-backend

