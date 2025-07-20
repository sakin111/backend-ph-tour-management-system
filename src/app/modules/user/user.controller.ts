/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyTokens } from "../../utils/jwt";
import { envVar } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";





 const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
     const result = await userServices.createUser(req.body)

         res.status(httpStatus.CREATED).json({
            message : "User created successfully",
            user: result
         })

         sendResponse(res,{
           success: true,
           statusCode: httpStatus.CREATED,
           message: "user created successfully",
           data: result
         
            
         })
 }) 
 const updatedUser = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

  const userId = req.params.id
  const verifyToken = req.user
//   const token = req.headers.authorization
//      const verifyToken = verifyTokens(token as string, envVar.JWT_ACCESS_SECRET) as JwtPayload
     const payload = req.body
     const result = await userServices.updateUser(userId, payload, verifyToken)
  

         res.status(httpStatus.CREATED).json({
            message : "User created successfully",
            user: result
         })

         sendResponse(res,{
           success: true,
           statusCode: httpStatus.CREATED,
           message: "user updated  successfully",
           data: result
         
            
         })
 }) 

const  getAllUser = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
        const result = await userServices.getAllUser()
        sendResponse(res,{
           success: true,
           statusCode: httpStatus.OK,
           message: "user retrieve successfully",
           data: result.data,
           meta: result.meta
         
            
         })
})



export const UserController ={
    createUser,
    getAllUser,
    updatedUser
    
}