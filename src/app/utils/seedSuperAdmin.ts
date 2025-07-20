import { envVar } from "../config/env";
import { IAuth, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs"


 export const seedSuperAdmin = async() => {
    try {
        const isSuperAdminExists = await User.findOne({email : envVar.SUPER_ADMIN_EMAIL})

        if(isSuperAdminExists){
            console.log("super admin already exists")
            return
        }

        const AuthProvider : IAuth = {
            provider: "Credential",
            providerId: envVar.SUPER_ADMIN_EMAIL
        }

 const hashPassword = await bcrypt.hash(envVar.SUPER_ADMIN_PASSWORD, Number(envVar.BCRYPT_SALT_ROUND) )

   const superAdminPayload : IUser = {
    name: "super admin",
    email: envVar.SUPER_ADMIN_EMAIL,
    password: hashPassword, 
    isVerified: true,
    auth: [AuthProvider]

   }
        const superAdmin = await User.create(superAdminPayload)
        return superAdmin
    } catch (error) {
        console.log(error)
    }
};

