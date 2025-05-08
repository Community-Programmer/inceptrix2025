import { Router } from "express";
import { createInterview } from "./interviewController";


const interviewRouter = Router();

interviewRouter.post("/createinterview", createInterview);


export default interviewRouter;