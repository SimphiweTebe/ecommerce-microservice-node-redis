# Microservice with Express and Redis

E-commerce micro-services that takes orders requests and payment processing. Built with Node server (Express) and Redis pub/sub pattern.

## Running the project

- Install all dependencies by running `yarn`in order-service and payment-service folders
- Run `yarn start` on each directory to start running services parallel
- Use PM2 to run services (coming soon)
- Use postman to make post requests

## Discoveries

- Creating separate services that communicate using message ques
- Redis pub/sub pattern with Redis core library and CLI
- PM2 process manager to monitor and debug applications