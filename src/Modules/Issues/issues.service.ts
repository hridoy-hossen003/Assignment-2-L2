import { response, type Request } from "express";
import type { AUser } from "../../interface/UserInterface";
import { pool } from "../../Database/db";
import { responseMacker } from "../Utilities/response";
import { error } from "node:console";

const createIssueInDb = async (payload: any, reporter_id: number) => {
  try {
    const { title, description, type } = payload;
    if (description.length < 200) {
      throw new Error("Description must be at least 20 characters");
    }
    const result = await pool.query(
      `
   INSERT INTO issues (title, description, type, reporter_id)
VALUES ($1,$2,$3,$4) RETURNING *
    `,
      [title, description, type, reporter_id],
    );
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getIssuesFromDb = async () => {
  try {
    const result = await pool.query(`
    SELECT * FROM issues
    `);
    const issues = result.rows;
    const reported_ids = [
      ...new Set(result.rows.map((issues) => issues.reporter_id)),
    ];

    const getUsers = await pool.query(
      `
    SELECT id , name , role FROM users WHERE id = ANY($1)
    `,
      [reported_ids],
    );
    const users = getUsers.rows;

    const issuesWithReporter = issues.map((issue) => {
      const { reporter_id, created_at, updated_at, ...rest } = issue;
      const reporter = users.find((user) => user.id === reporter_id);
      const report = {
        ...rest,
        reporter,
        created_at,
        updated_at,
      };
      return report;
    });

    return issuesWithReporter;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const issuesService = {
  createIssueInDb,
  getIssuesFromDb,
};
