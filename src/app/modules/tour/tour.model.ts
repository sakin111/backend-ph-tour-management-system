import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypesSchema = new Schema<ITourType>({
    name: {type: String, required: true, unique: true},
  

},{
    timestamps: true
})

export const TourType = model<ITourType>("tourType", tourTypesSchema)

const tourSchema = new Schema<ITour>({
    name: {type: String, required: true, unique: true},
   slug: {type:String, unique: true},
   description:{type: String},
   images: {type:[String], default: []},
   location: {type: String},
   costFrom: {type: Number},
   startDate: {type: Date},
   endDate: {type: Date},
   included:{type:[String], default: []},
   excluded: {type:[String], default: []},
   amenities:{type:[String], default: []},
   tourPlan:{type:[String], default: []},
   maxGuest: {type: Number},
   minAge:{type: Number},
   division: {
    type: Schema.Types.ObjectId,
    ref: "Division",
    required: true
   },
   tourType:{
    type: Schema.Types.ObjectId,
    ref: "tourType",
    required: true
   }


},{
    timestamps: true
})

export const TourSchema = model<ITour>("tourSchema", tourSchema)