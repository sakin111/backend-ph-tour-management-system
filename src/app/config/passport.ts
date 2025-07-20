
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVar } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as localStrategy } from "passport-local";
import passport from "passport";
import bcrypt from "bcryptjs"



passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async function (email: string, password: string, done) {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done(null, false, { message: "user does not exists" });
        }
        const isGoogleAuthenticated = isUserExist.auth?.some(providerObject => providerObject.provider == "Google")

        if(isGoogleAuthenticated && !isUserExist.password ){
             return done(null, false, { message: "user is authenticated with google and does not have any password field" });
        }
       
    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        return done(null, false, { message: "password did not match" });
    }
        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
)


passport.use(
    new GoogleStrategy({
        clientID: envVar.GOOGLE_CLIENT_ID,
        clientSecret: envVar.GOOGLE_CLIENT_SECRET,
        callbackURL: envVar.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) =>{
   try {
      const email = profile.emails?.[0].value
      if(!email){
        return done(null, false, {message: "no email found"})
      }
        let user = await User.findOne({email})
          if(!user){
         user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auth: [
                {
                    provider: "google",
                    providerId: profile.id
                }
            ]
         })
      }
      return done(null, user)
   } catch (error) {
    console.log("google strategy error", error)
    return done(error)
   }
    })
)


// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})