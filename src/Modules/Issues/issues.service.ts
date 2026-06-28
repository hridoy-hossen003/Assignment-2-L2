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
 } catch (error : any) {
    throw new Error(error.message)
 }

};

export const issuesService = {
  createIssueInDb,
};
