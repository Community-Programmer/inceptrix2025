import express, { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import globalErrorHandler from './middleware/globalErrorHandler';
import passport from 'passport'
import passportConfig from './config/passport';
import authRouter from './auth/authRoute';
import interviewRouter from './Interview/interviewRoute';
import mongoose from 'mongoose';
import industryRoutes from './Insights/industryRoutes';

config();

const app = express();
mongoose.connect(process.env.DATABASE_URL || 'dfgh')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use('/api/industry', industryRoutes);

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
passportConfig(passport);




app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Next-Hire App Express Backend',
  });
});

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/interview', interviewRouter);
  app.use(globalErrorHandler);

export { server, io };
