// flat.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFlat extends Document {
  city: string;
  stName: string;
  stNum: number;
  size: number;
  hasAC: boolean;
  year: number;
  price: number;
  availDate: Date;
  owner: mongoose.Types.ObjectId; 
}

const flatSchema = new Schema<IFlat>({
  city: { type: String, required: true },
  stName: { type: String, required: true },
  stNum: { type: Number, required: true },
  size: { type: Number, required: true },
  hasAC: { type: Boolean, default: false },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  availDate: { type: Date, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true } // 🔗 User 연결
});

export const Flat = mongoose.model<IFlat>("Flat", flatSchema, "flat");