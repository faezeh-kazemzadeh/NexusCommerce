import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { errorHandlerMiddelware } from './middleware/errorHandler.middleware.js';



import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';


dotenv.config();

connectDB();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use('/upload', express.static('upload'));
app.use(express.static("upload"));


app.use('/api/auth',authRouter);
app.use('/api/users',userRouter);

app.get('/',(req, res) => {
    res.json({ message: '   API is running from Docker!' });
});


app.use(errorHandlerMiddelware());
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})