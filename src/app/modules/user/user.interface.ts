import { Types } from "mongoose";

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    GUIDE = 'GUIDE',
    SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface IAuth {
    provider : "Credential" | "Google";
   providerId : string ;
}

export enum IisActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED"
}


export interface IUser {
    _id: Types.ObjectId
    name : string;
    email : string ;
    password ? : string;
    phone ? : string;
    picture ? : string;
    address ? : string;
    isDeleted ? : boolean;
    isActive ? : IisActive;
    isVerified ? : boolean;
    role ? : Role ;
    auth ? : IAuth[];
    bookings ? : Types.ObjectId[];
    guides ? : Types.ObjectId[] ;

}