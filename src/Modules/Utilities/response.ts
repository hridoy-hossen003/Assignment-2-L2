import type { Response } from "express";

export const responseMacker = <T>(statusCode : number , success : boolean , message : string, res : Response, data ?: T ) =>{
return res.status(statusCode).json({
    success,
    message , 
    data
})
}