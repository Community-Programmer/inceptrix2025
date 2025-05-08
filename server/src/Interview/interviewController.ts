import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../prisma/client';
import createHttpError from 'http-errors';


const createInterview = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, jobRole, model, extraInfo } = req.body;

  try {
    const newInterview = await prisma.interview.create({
        data: {
          title,
          description,
          jobRole,
          model,
          extraInfo,
        },
      });
  
      res.status(201).json(newInterview);
   
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, 'Error while processing your request'));
  }
};

export { createInterview, };
