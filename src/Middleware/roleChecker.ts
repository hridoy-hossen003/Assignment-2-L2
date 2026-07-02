import type { NextFunction, Request, Response } from "express";
import type { typeRoles } from "../interface/UserInterface";
import { pool } from "../Database/db";
import { responseMacker } from "../Modules/Utilities/response";

export const roleChecker = (...roles: typeRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const issueData = await pool.query(
        `
            SELECT * FROM issues WHERE id = $1
            `,
        [id],
      );

      if (issueData.rows.length === 0) {
        responseMacker(
          404,
          false,
          "issue not found please verify your input.",
          res,
        );
        return;
      }

      const issue = issueData.rows[0];
      const role = req.user.role;
      if (role === "maintainer") {
        next();
      } else {
        if (issue.reporter_id !== req.user.id) {
          responseMacker(
            403,
            false,
            "Forbidden !! you can't update this issue",
            res,
          );
          return;
        }
        if (issue.status !== "open") {
          responseMacker(
            409,
            false,
            "Conflict!! status is not open for everyone.",
            res,
          );
          return;
        }
        next();
      }
    } catch (error: any) {
      responseMacker(500, false, error.message, res);
    }
  };
};
