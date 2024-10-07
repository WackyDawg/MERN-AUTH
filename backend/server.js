import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/connectDB.js";
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware or any other setup can go here
app.use(express.json());
app.use(cookieParser())
app.get("/", (req, res) => res.send("Frontend server"));

//Routes  
app.use('/api/v1/auth', authRoutes);


app.listen(port, async () => {
    await connectDB();
    console.log(`Example app listening on port ${port}!`);
});
