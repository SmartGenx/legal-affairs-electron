// src/index.js or src/app.js
const express = require('express');
// const rootRouter = require('./routers');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const cors = require('cors');
require('dotenv').config();
class App {
    constructor() {
        this.app = express();
        this.setMiddlewares();
        this.setRoutes();
        this.setErrorMiddlewares();
    }

    setMiddlewares() {
        // It's good to have a middleware that parses incoming requests with JSON payloads.
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: true })); // `true` allows for rich objects and arrays to be encoded into the URL-encoded format.
        // CORS and other security-related middleware would also go here.
        const corsOptions = {
            origin: ['*'], // Specify the allowed origin
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specify which methods are allowed
            allowedHeaders: ['Content-Type', 'Authorization'] // Specify which headers are allowed
        };
      
        this.app.use(cors(corsOptions));
    }

    setRoutes() {
        // Prefixing the routes with '/api' is a common convention for indicating that this is an API endpoint.
        // this.app.use('/api', rootRouter);
        // Here you would add the other routes in a similar manner.
        // Example: this.app.use('/api/users', userRoutes);
    }

    setErrorMiddlewares() {
        // Error handling middleware should be the last middleware added.
        this.app.use(errorMiddleware);
    }
   
    listen() {
        const PORT = process.env.PORT || 3000; // Good use of environment variable for the PORT with a fallback.
        this.app.listen(PORT, async () => {
            console.log(`Server is running on http://localhost:${PORT}`); // Informative startup log is useful.
        });
    }
}

// This part initiates your app listening, so it makes sense to be outside of the App class.
const appInstance = new App().app;
module.exports = appInstance;

// If you want to start the server directly from this file
if (require.main === module) {
    const app = new App();
    app.listen();
}
