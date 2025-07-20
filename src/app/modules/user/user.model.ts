import { model, Schema } from "mongoose";
import { IAuth, IisActive, IUser, Role } from "./user.interface";


const AuthSchema = new Schema<IAuth>({
    provider: {type: String, required: true},
    providerId : { type: String, required: true}         
            
},{
    timestamps: true,
    versionKey: false
})



const UserSchema = new Schema<IUser>({
        name :{type : String, required: true},
         email : {type: String , required: true, unique: true},
         password  : {type: String},
         role: {
            type: String,
            enum: Object.values(Role),
            default: Role.USER
         },
          phone  : {type : String},
             picture  : {type: String},
             address  : {type: String},
             isDeleted : {type : Boolean, default : false},
             isActive  : {
                type: String,
                enum: Object.values(IisActive),
                default: IisActive.ACTIVE
             },
             isVerified : {type: String, default: 'false'},
             auth: [AuthSchema]
             
            
},{
    timestamps: true,
    versionKey: false
})

export const User = model<IUser>("User", UserSchema);