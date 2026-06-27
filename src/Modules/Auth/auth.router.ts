import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()
router.post("/signup" , authController.AuthSignUP)
router.get("/" , authController.getUsers)
router.get("/:id" , authController.getSpacificUser)
router.post("/login" , authController.loginUser)
export const authRouter = router