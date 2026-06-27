import type { Response } from "express";
import type { AUser } from "../../interface/UserInterface";


export const responseMacker = <T>(statusCode : number , success : boolean , message : string, data : T , res : Response) =>{
return res.status(statusCode).json({
    success,
    message , 
    data
})
}