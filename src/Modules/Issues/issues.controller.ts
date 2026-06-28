import { response, type Request, type Response } from "express";
import { issuesService } from "./issues.service";
import { request } from "node:http";
import { responseMacker } from "../Utilities/response";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporter_id = req.user.id;
    const result = await issuesService.createIssueInDb(req.body, reporter_id);
    console.log(result);
      responseMacker(200, true, "Issue created successfully", res, result.rows[0]);
  } catch (error: any) {
    responseMacker(500, false, error.message, res);
  }
};

export const issuesController = {
  createIssue,
};
