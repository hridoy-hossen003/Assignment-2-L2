import express, { type Application, type Request, type Response } from "express"
import { config } from "./config/config";
const app : Application = express();
const port = config.port;

app.get("/", (req : Request, res : Response) => {
  res.send("Hello World! hridoy");
});

export default app