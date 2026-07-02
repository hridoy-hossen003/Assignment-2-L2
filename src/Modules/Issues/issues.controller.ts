import { response, type Request, type Response } from "express";
import { issuesService } from "./issues.service";
import { request } from "node:http";
import { responseMacker } from "../Utilities/response";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporter_id = req.user.id;
    const result = await issuesService.createIssueInDb(req.body, reporter_id);
    console.log(result);
    responseMacker(
      200,
      true,
      "Issue created successfully",
      res,
      result.rows[0],
    );
  } catch (error: any) {
    responseMacker(500, false, error.message, res);
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;

    const result = await issuesService.getIssuesFromDb({
      sort: sort as string | undefined,
      type: type as string | undefined,
      status: status as string | undefined,
    });
    responseMacker(200, true, "Get all issues successfully", res, result);
  } catch (error: any) {
    responseMacker(400, false, error.message, res);
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = issuesService.getSingleIssueDb(Number(id));
    responseMacker(200, true, "Issue retrived successfully", res, await result);
  } catch (error: any) {
    responseMacker(404, false, error.message, res);
  }
};

const updateIssues = async (req: Request, res: Response) => {
  try {
    const issueId = req.params.id as string;
    const { title, description, type } = req.body;
    const result = await issuesService.updateIssueDb({
      title,
      description,
      type,
      issueId,
    });
    if (description.length <= 200) {
      responseMacker(
        400,
        false,
        "Bad Request !! description must be over 200 charectors.",
        res,
      );
      return;
    }
    responseMacker(
      200,
      true,
      "Issue updated successfully",
      res,
      result.rows[0],
    );
  } catch (error: any) {
    responseMacker(500, false, error.message, res);
  }
};
export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssues,
};
