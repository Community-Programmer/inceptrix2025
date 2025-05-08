import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../prisma/client';
import createHttpError from 'http-errors';
import { use } from 'passport';
import { AuthRequest } from '../types/authType';

// Create a new interview
const createInterview = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, jobRole, model, extraInfo } = req.body;
    const userId = req.user as AuthRequest; // Assuming req.user is populated by passport;

    try {
        const newInterview = await prisma.interview.create({
            data: {
                title,
                description,
                jobRole,
                model,
                extraInfo,
                userId: userId.id,
            },
        });

        res.status(201).json(newInterview);
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, 'Error while processing your request'));
    }
};

const getInterviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const userId = req.user as AuthRequest;
    const interviews = await prisma.interview.findMany({
      where: { userId: userId.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(interviews);
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, 'Failed to fetch interviews'));
    }
};

const getInterviewById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const interview = await prisma.interview.findUnique({
            where: { id},
        });

        if (!interview) {
            return next(createHttpError(404, 'Interview not found'));
        }

        res.status(200).json(interview);
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, 'Error retrieving interview'));
    }
};

export { createInterview, getInterviews, getInterviewById };
