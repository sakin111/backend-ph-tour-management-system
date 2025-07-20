import AppError from "../../errorHelpers/appError";
import { IAuth,  IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVar } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async(payload: Partial<IUser>) =>{

    const { email, password, ...rest} = payload;
    const isUserExist = await User.findOne({email})
    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "user already exist")
    }

    const hashPass =await bcrypt.hash(password as string, Number(envVar.BCRYPT_SALT_ROUND))

    const authProvider : IAuth = {provider:"Credential" , providerId: email as string }
   const user = await User.create({
            email,
            password : hashPass,
            auth: [authProvider],
            ...rest
         
        })
        return user
}


const updateUser = async (userId: string, payload:Partial<IUser>, decodedToken:JwtPayload) =>{
    
    const ifUserExists = await User.findById(userId)

    if(!ifUserExists){
        throw new AppError(httpStatus.NOT_FOUND, "user does not exists")
    }
    // if(ifUserExists.isDeleted || ifUserExists.isActive === IisActive.BLOCKED){
    //        throw new AppError(httpStatus.NOT_FOUND, "you can not update")
    // }
    
    if(payload.role){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new AppError(httpStatus.FORBIDDEN, "you are unauthorized")
        }
        if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
     throw new AppError(httpStatus.FORBIDDEN, "you are unauthorized")
        }

    }
    if(payload.isActive || payload.isDeleted || payload.isVerified) {
          if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new AppError(httpStatus.FORBIDDEN, "you are unauthorized")
        }
    }
    if(payload.password){
        payload.password = await bcrypt.hash(payload.password, envVar.BCRYPT_SALT_ROUND)
    }

    const newUserUpdate = await User.findByIdAndUpdate(userId, payload, {new : true})
    return newUserUpdate
}


const getAllUser = async() =>{
    const user = await User.find({})
    const totalUser = await User.countDocuments()
    return {
        data: user,
        meta: {
            totalUser
        }
    }
}


export const userServices = {
 createUser,
 getAllUser,
 updateUser
}