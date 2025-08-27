import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  birthdate: Date;
  type: string[];
  admin: boolean;
  flats?: mongoose.Types.ObjectId[];
  favorites?: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthdate: { type: Date, required: true },
  type: [{ type: String }],
  admin: { type: Boolean, default: false },
  flats: [{ type: Schema.Types.ObjectId, ref: "Flat", default: [] }], 
  favorites: [{ type: Schema.Types.ObjectId, ref: "Flat", default: [] }] 
});

export const User = mongoose.model<IUser>("User", userSchema, "user");


