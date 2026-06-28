import express, { type Application, type Request, type Response } from "express"
import { config } from "./config/config";
import { authRouter } from "./Modules/Auth/auth.router";
import { issuesRouter } from "./Modules/Issues/issues.router";
const app : Application = express();
const port = config.port;
app.use(express.json())
app.use(express.text());
app.get("/", (req : Request, res : Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
  });
});
app.use("/api/auth" , authRouter);
app.use("/api/issues", issuesRouter);

export default app