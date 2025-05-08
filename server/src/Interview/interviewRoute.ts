import { Router } from 'express';
import {
  createInterview,
  getInterviews,
  getInterviewById
} from './interviewController';

const interviewRouter = Router();

interviewRouter.post('/createinterview', createInterview);
interviewRouter.get('/getinterviews', getInterviews);
interviewRouter.get('/getinterview/:id', getInterviewById);

export default interviewRouter;
