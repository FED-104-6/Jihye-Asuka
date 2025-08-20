// server.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://flatPrj:<db_password>@flat-project.ipg6e7g.mongodb.net/")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

// User 모델
const UserSchema = new mongoose.Schema({ name: String, age: Number });
const User = mongoose.model("User", UserSchema);

// API
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
