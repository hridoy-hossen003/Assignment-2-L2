import dotenv from "dotenv";
import path from "path";


dotenv.config({
    path: path.join(process.cwd(), ".env"),
  });


export const config = {
  port: process.env.PORT,
  connectionString: process.env.CONNECTIONSTRING,
  ACCESS_SECRATE: process.env.ACCESS_SECRATE,
  REFRESH_SECRATE: process.env.REFRESH_SECRATE,
};

