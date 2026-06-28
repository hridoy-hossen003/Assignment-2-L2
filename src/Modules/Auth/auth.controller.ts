import { response, type Request, type Response } from "express";
import { authService } from "./auth.service";
import { responseMacker } from "../Utilities/response";

const AuthSignUP = async (req: Request, res: Response) => {
  try {
    const result = await authService.authSignUpDB(req.body);
    await res.status(200).json({
      success: true,
      message: "user created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    await res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await authService.getUserFromDb();
    res.status(200).json({
      success: true,
      message: "get user successfully",
      data: result,
    });
  } catch (error: any) {
    await res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSpacificUser =  async (req : Request , res : Response) =>{
 try {
   const { id } = req.params;
   const result = await authService.getSpacificUserFromDB(Number(id));
   if (result.rows.length === 0) {
await res.status(404).json({
       success: false,
       message: "user not exists",
     });
   
   }

   res.status(200).json({
     success: true,
     message: "user get successfully",
     data: result.rows[0],
   });
 }catch (error: any) {
    await res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

const loginUser = async (req: Request, res: Response) => {
  try {
    const {refreshToken , ...rest} = await authService.loginUserDb(req.body);

    res.cookie("refreshToken" , refreshToken,{
      secure: false,
      sameSite : 'lax',
      httpOnly:true, //for keeping away from js reading.
    })
  
    responseMacker(200, true, "login successfully", res, rest) ;
  } catch (error : any) {
    responseMacker(401,false , error.message , error ,res)
  }
};

export const authController = {
  AuthSignUP,
  getUsers,
  getSpacificUser,
  loginUser
};
