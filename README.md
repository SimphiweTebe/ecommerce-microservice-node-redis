# Microservices with Express + Redis

E-commerce application that takes orders from API requests and processes payment. Built with Node server (Express) and Redis pub/sub pattern. Uses PM2 to manage and monitor the application servers.

## Running the project

- Install all dependencies by running `yarn`in order-service and payment-service folders
- Run `yarn start` on each directory to start running services parallel
- Use PM2 to run services in by running yarn install inside the root folder (if on localhost) then run `PM2 start all`
- Use postman to make post requests

## Discoveries

- Creating separate services that communicate using message ques
- Redis pub/sub pattern with Redis core library and CLI
- PM2 process manager to monitor and debug applications