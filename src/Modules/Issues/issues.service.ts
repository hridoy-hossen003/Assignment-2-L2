import { response, type Request } from "express";
import type { AUser } from "../../interface/UserInterface";
import { pool } from "../../Database/db";
import { responseMacker } from "../Utilities/response";
import { error } from "node:console";
import { title } from "node:process";
import { describe } from "node:test";

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

const getIssuesFromDb = async (filter: {
  sort?: string | undefined;
  type?: string | undefined;
  status?: string | undefined;
}) => {
  try {
    const condition: string[] = [];
    const values: string[] = [];
    if (filter.type) {
      values.push(filter.type);
      condition.push(`type = $${values.length}`);
    }

    if (filter.status) {
      values.push(filter.status);
      condition.push(`status = $${values.length}`);
    }
    const whereClause =
      condition.length > 0 ? `WHERE ${condition.join(" AND ")}` : " ";
    const orderClause =
      filter.sort === "oldest"
        ? "ORDER BY created_At ASC"
        : "ORDER BY created_At DESC";

    const result = await pool.query(
      `
    SELECT * FROM issues ${whereClause} ${orderClause}
    `,
      values,
    );

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

const getSingleIssueDb = async (id: number) => {
  try {
    const issue = await pool.query(
      `
  SELECT * FROM issues WHERE id = $1
  `,
      [id],
    );
    if (issue.rows.length === 0) {
      throw new Error("Invalid credential..!");
    }
    const reporters_id = issue.rows[0].reporter_id;
    const user = await pool.query(
      `
    SELECT id , name , role FROM users WHERE id = $1
    `,
      [reporters_id],
    );
    const { reporter_id, created_at, updated_at, ...rest } = issue.rows[0];
    const reporter = user.rows[0];
    const data = {
      ...rest,
      reporter,
      created_at,
      updated_at,
    };

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const updateIssueDb = async (payload: {
  title: string | undefined;
  description: string | undefined;
  type: string | undefined;
  issueId: string | undefined;
}) => {
  const { title, description, type, issueId } = payload;
  const result = await pool.query(
    `
  UPDATE issues SET title = COALESCE($1,  title) , description = COALESCE($2,  description) , type = COALESCE($3 ,type) , updated_at = NOW() WHERE id = $4  RETURNING *
  `,
    [title, description, type, issueId],
  );

  return result;
};

export const issuesService = {
  createIssueInDb,
  getIssuesFromDb,
  getSingleIssueDb,
  updateIssueDb,
};
// "title": "Updated: Database pool exhaustion fix needed",
//   "description": "Updated description with reproduction steps...",
//   "type": "bug"
