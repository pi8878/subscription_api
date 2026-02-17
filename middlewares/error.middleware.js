// Global error handling middleware for the subscription API.
// This middleware will catch any errors that occur in the routes and send a consistent error response to the client.

const errorMiddleware = (err, req, res, next) => {
    try {
        // destructure the error object to get the status code and message, and set default values if they are not provided
        let error = { ...err };

        // Set the status code to 500 if it is not provided, and set the message to a generic error message if it is not provided
        error.message = err.message;

        console.error(err);


        // Mongoose bad ObjectId error handling (e.g. when an invalid ID is provided in the URL)
        if (err.name === 'CastError') {
            const message = 'Resource not found';

            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key error handling (e.g. when trying to create a subscription with a name that already exists)
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error handling (e.g. when required fields are missing or invalid)
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            error = new Error(message);
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error'
        });

    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;

// Ended at 1:27:48 and have to start JWT Auth now in the video