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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT CHECK (LENGTH(description) >= 200) NOT NULL,
      type VARCHAR(20) CHECK (type IN('bug' , 'feature_request')) NOT NULL,
      status VARCHAR(20) DEFAULT 'open' CHECK(status IN('open','in_progress','resolved')) NOT NULL,
     reporter_id INT NOT NULL,
     created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()

      )
      `);
    console.log("database created successfully..");
  } catch (error: any) {
    throw new Error(error.message);
  }
};
