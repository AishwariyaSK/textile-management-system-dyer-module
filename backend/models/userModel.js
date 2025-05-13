// models/User.js
import { Schema, model, mongoose } from 'mongoose';

const userSchema = new Schema({
  role: { type: String, required: true, enum: ['buyer', 'dyer', 'admin'] },
  companyName: { type: String, required: true },
  proprietorName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true,},
  approved: { type: Boolean, default: false }
});

const userModel=mongoose.models.user || model("User", userSchema);
export default userModel;
