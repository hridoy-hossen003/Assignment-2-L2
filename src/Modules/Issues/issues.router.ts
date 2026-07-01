import { Router } from "express";
import app from "../../app";
import { issuesController } from "./issues.controller";
import auth from "../../Middleware/auth";
import { roles } from "./Roles";

const router = Router()
router.post(
  "/",
  auth(roles.contributor, roles.maintainer),
  issuesController.createIssue,
);
router.get("/", issuesController.getAllIssues);



export const issuesRouter = router;