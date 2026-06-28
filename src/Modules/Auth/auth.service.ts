import { Pool, Result } from "pg";
import { pool } from "../../Database/db";
import bcrypt from "bcrypt";
import type { AUser } from "../../interface/UserInterface";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../../config/config";

const authSignUpDB = async (payload: any) => {
  try {
    const { name, email, password, role } = payload;
    const hashPassword = await bcrypt.hash(String(password), 10);
    const result = await pool.query(
      `
    INSERT INTO users (name , email , password, role) VALUES($1 ,$2, $3 , COALESCE($4 , 'contributor')) RETURNING *
    `,
      [name, email, hashPassword, role],
    );

    delete result.rows[0].password;
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getUserFromDb = async () => {
  try {
    const result = await pool.query(`
        SELECT * FROM users
        `);
     const resultWithOutPass = result.rows.map(user => {
    const {password , ...rest} = user 
    return rest
     })
    return resultWithOutPass;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getSpacificUserFromDB = async (id: number) => {
  try {
    const result = await pool.query(
      `
        SELECT * FROM users WHERE id = $1
        `,
      [id],
    );
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const loginUserDb = async (payload: AUser) => {
  const { email, password } = payload;
  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email = $1
        `,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("user not exists");
  }

  const user = userData.rows[0];

  const checkPassword = await bcrypt.compare(
    String(password),
    user.password as string,
  );
  if (!checkPassword) {
    throw new Error("invalide password");
  }


  const jwtpayload : JwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
  };

  const accessToken =jwt.sign(jwtpayload, config.ACCESS_SECRATE as string , {expiresIn : '1d'})
  const refreshToken = jwt.sign(jwtpayload , config.REFRESH_SECRATE as string , {expiresIn:"30d"})
  return {user,accessToken , refreshToken}
};

export const authService = {
  authSignUpDB,
  getUserFromDb,
  getSpacificUserFromDB,
  loginUserDb,
};
