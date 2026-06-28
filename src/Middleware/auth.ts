import type { NextFunction, Request, Response } from "express";
import type { typeRoles } from "../interface/UserInterface";
import { responseMacker } from "../Modules/Utilities/response";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";
import { pool } from "../Database/db";

const auth = (...roles: typeRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      //check if token is exists or not
      responseMacker(401, false, "unauthorized access !!", res);
    }
    const decode = jwt.verify(
      //decode the jwt token
      token as string,
      config.ACCESS_SECRATE as string,
    ) as JwtPayload;

    const userData = await pool.query(
      // tring to find in our database.
      `
            SELECT * FROM users WHERE email = $1
            `,
      [decode.email],
    );

    if (userData.rows.length === 0) {
      //check if your is exist or not
      responseMacker(404, false, "user not found", res);
    }
    const user = userData.rows[0];

    if (roles.length && !roles.includes(user.role)) {
      //check if user has proper role on it
      responseMacker(
        403,
        false,
        "Forbidden! You don't have permission to access this resource.",
        res,
      );
    }
    req.user = user;

    next();
  };
};

export default auth;
