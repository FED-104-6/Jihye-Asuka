import mongoose, { Schema, Document } from "mongoose";

export interface IMsg extends Document {
  content: string;
  createdAt: Date;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  flat: mongoose.Types.ObjectId; 
}

const msgSchema = new Schema<IMsg>({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  flat: { type: Schema.Types.ObjectId, ref: "Flat", required: true },
});

export const Message = mongoose.model<IMsg>("Message", msgSchema, "message");