import { Pool } from "pg";
import { config } from "../config/config";
export const pool = new Pool({
  connectionString: config.connectionString,
});

export const initDb = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(30) UNIQUE NOT NULL,
            password TEXT,
            role VARCHAR(20) DEFAULT 'contributor' CHECK (role IN ('contributor' , 'maintainer')),
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
            )
            `);

    console.log("database created successfully..");
  } catch (error: any) {
    throw new Error("there is something unusule in database");
  }
};
