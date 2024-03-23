# Microservices with Express + Redis

Event driven Ecommerce microservices with orders and payment processing. Built on a Node server (Express) and Redis pub/sub pattern. Used PM2 to manage and monitor the application processes activity.

## Running the project

- Install all dependencies by running `yarn`in order-service and payment-service folders
- Run `yarn start` on each directory to start running services parallel
- If you have PM2 installed globally inside the root folder run `PM2 start pm2-apps-config.local.json`  
- You can use postman to make post requests

## Discoveries

- Creating separate services that communicate using message ques
- Redis pub/sub pattern with Redis core library and CLI
- PM2 process manager to monitor and debug applications