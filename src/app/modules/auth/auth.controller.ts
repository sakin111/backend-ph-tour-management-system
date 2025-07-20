/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes";
import { authServices } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { setAuthCookies } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../../config/env";
import { createUserTokens } from "../../utils/userTokens";
import passport from "passport";



const CredentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // const loginInfo = await authServices.credentialsLogin(req.body)

  passport.authenticate("local", async (err: any, user: any, info: any) => {

    if (err) {
      return next(new AppError(401, err));
    
    }

    if (!user) {
      return new AppError(401, info.message)
    }


   const {password: pass, ...rest} = user.toObject()

    const userToken = createUserTokens(user);

    setAuthCookies(res, userToken);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user login successful",
      data: {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
      }
    });
  })(req, res, next);
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "can not found refresh token")
  }
  const tokenInfo = await authServices.getNewAccessToken(refreshToken)


  //   res.cookie("accessToken ", tokenInfo.accessToken,{
  //   httpOnly: true,
  //   secure: false
  // } )
  setAuthCookies(res, tokenInfo)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "user retrieved successfully",
    data: tokenInfo


  })
})


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })



  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "user logged out successfully",
    data: null


  })
})



const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;
  await authServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)




  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "password changed successfully",
    data: null


  })
})

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  let redirectTo = req.query.state ? req.query.state as string : ""

  if (redirectTo.startsWith("/")) {
    redirectTo = redirectTo.slice(1)
  }


  const user = req.user;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
  }

  const tokenInfo = createUserTokens(user)

  setAuthCookies(res, tokenInfo)


  res.redirect(`${envVar.FRONTEND_URL}/${redirectTo}`)
})



export const authController = {
  CredentialLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController
}