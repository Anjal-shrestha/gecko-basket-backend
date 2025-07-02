import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

// Create the server
const server = http.createServer(app);

// --- Database Connection ---
mongoose.connection.once('open', () => {
    console.log('✅ MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err}`);
});

async function startServer() {
    // Ensure MONGO_URI is not undefined
    if (!MONGO_URI) {
        console.error('Fatal Error: MONGO_URI is not defined in the .env file.');
        process.exit(1);
    }
    
    await mongoose.connect(MONGO_URI);

    server.listen(PORT, () => {
        console.log(`🚀 Server is listening on http://localhost:${PORT}`);
    });
}

startServer();