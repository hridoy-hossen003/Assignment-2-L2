import type { Request, Response } from "express"
import app from "./app";
import { config } from "./config/config";

const main = () =>{
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
}

main()