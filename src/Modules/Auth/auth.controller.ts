import type { Request, Response } from "express";
import { authService } from "./auth.service";

const AuthSignUP = async (req: Request, res: Response) => {
  try {
  const result = await authService.authSignUpDB(req.body);
    await res.status(200).json({
      success: true,
      message: "user created successfully",
      data : result.rows[0]
    });
  } catch (error: any) {
    await res.status(200).json({
      success: true,
      message: error.message,
    });
  }
};

export const authController = {
    AuthSignUP
}