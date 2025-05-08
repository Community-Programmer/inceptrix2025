import { Router } from 'express';
import {
  createInterview,
  getInterviews,
  getInterviewById
} from './interviewController';
import passport from 'passport';

const interviewRouter = Router();

interviewRouter.post('/createinterview',passport.authenticate('jwt', { session: false }), createInterview);
interviewRouter.get('/getinterviews',passport.authenticate('jwt', { session: false }), getInterviews);
interviewRouter.get('/getinterview/:id',passport.authenticate('jwt', { session: false }), getInterviewById);

export default interviewRouter;
