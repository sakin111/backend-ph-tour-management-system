import { NextFunction, Request, Response } from "express"
import AppError from "../errorHelpers/appError"
import { envVar } from "../config/env"
import { verifyTokens } from "../utils/jwt"
import { JwtPayload } from "jsonwebtoken"


export const checkAuth = (...authRole : string[]) => (req: Request, res: Response, next: NextFunction) =>{
try {
        const accessToken = req.headers.authorization
    if(!accessToken){
        throw new AppError(403, "token us not provided")
    }
    const verifyToken = verifyTokens(accessToken, envVar.JWT_ACCESS_SECRET) as JwtPayload
    if(authRole.includes(verifyToken.role)){
         throw new AppError(403, "forbidden access to this route")
    }
   req.user = verifyToken
   next()
    
} catch (error) {
    console.log("jwt error", error)
    next()
}
}