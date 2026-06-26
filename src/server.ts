import type { Request, Response } from "express"
import app from "./app";
import { config } from "./config/config";
import { initDb } from "./Database/db";

const main = () =>{
    initDb()
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
}

main()