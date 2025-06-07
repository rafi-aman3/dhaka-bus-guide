# Dhaka Bus API

A RESTful API service for managing bus stoppages in Dhaka city.

## Features

- CRUD operations for bus stoppages
- Validation middleware
- Error handling
- Logging system
- Prisma ORM integration

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma (ORM)
- PostgreSQL


## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository

2. Install dependencies:

```
npm install
```


3. Set up environment variables in .env file:
```
DATABASE_URL="postgresql://user:password@localhost:5432/dhaka_bus"
```

4. Run database migrations:
```
npx prisma migrate dev
```

### Development
Start the development server:

```
npm run dev
```
### Production
Build and start the production server:

```
npm run build
npm start
```
## API Endpoints
### Stoppages
- GET /stoppages - Get all stoppages
- GET /stoppages/:id - Get a specific stoppage
- POST /stoppages - Create a new stoppage
- PUT /stoppages/:id - Update a stoppage
- DELETE /stoppages/:id - Delete a stoppage
## Error Handling
The API uses a global error handler and custom ApiError class for consistent error responses. All errors return a JSON response with:

- success : boolean
- message : error description
- error : detailed error information (in development)
## Logging
The application uses a custom logger for tracking API operations and errors.

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
