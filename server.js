const app = require('./app');
const connectDatabase = require('./config/database');

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error ${err.message}`)
    console.log('Shutting down the server due to uncaught exception')
    process.exit(1)
})

// connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})

// unhandled promise rejection
process.on("unhandledRejection", err => {
    console.log(`Error ${err.message}`)
    console.log('Shutting down the server due to unhandled promise rejection')
    server.close(() => {
        process.exit(1)
    })
})

