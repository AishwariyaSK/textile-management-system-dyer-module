import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createNotificationFunction } from "./notificationController.js";

const createToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 }); // 1 day
};

const registerUser= async (req, res)=>{
    const { role, companyName, proprietorName, address, phone, email, password } = req.body;
    try {
        const existUser=await userModel.findOne({email});
        if (existUser && !existUser.approved){
            return res.status(400).json({error: "user already exists but not approved"});
        }
        if (existUser){
            return res.status(400).json({error: "user already exists"});
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser=await userModel.create({
                role,
                companyName,
                proprietorName,
                address,
                phone,
                email,
                password: hashedPassword
            });
            const user=await newUser.save();
            // const token=createToken(user._id, role);
            await createNotificationFunction({
                message: `New ${role} registration approval request from ${companyName}`,
                category: "approve",
                isForAdmin: true
            });
            res.status(200).json({success:true, message: "user created successfully"});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

const loginUser=async (req,res)=>{
    try{
        const {email, password}=req.body;
        const user=await userModel.findOne({email});
        if (!user){
            return res.status(400).json({error: "user not found"});
        }
        if (!user.approved){
            return res.status(400).json({error: "user account created but not approved"});
        }
        const isMatch=await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({error: "invalid credentials"});
        }
        const token=createToken(user._id, user.role);
        res.status(200).json({success:true, token, user});
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

const AdminLogin=async (req,res)=>{
    try{
        const {email, password}=req.body;
        if (email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token=createToken(process.env.ADMIN_EMAIL,"admin");
            res.status(200).json({success:true, token});
        }
        else{
            return res.status(400).json({error: "invalid credentials"});
        }
    }catch(err){    
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

import mongoose from 'mongoose';

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const fallbackId = req.user?._id;

    // console.log("User ID from request:", id);
    // console.log("Fallback ID from token:", fallbackId);

    const targetId = (id && id !== 'undefined') ? id : fallbackId;
    // console.log("Target ID to search for:", targetId);

    if (!targetId || !mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    const user = await userModel.findById(targetId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Error in getUser:", err);
    return res.status(500).json({ error: err.message });
  }
};


const getAllUsers=async (req,res)=>{
    try{
        const users=await userModel.find({});
        res.status(200).json({success:true, users});
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

const deleteUser=async (req,res)=>{
    try{
        const {id}=req.params;
        const user=await userModel.findByIdAndDelete(id);
        if (!user){
            return res.status(400).json({error: "user not found"});
        }
        res.status(200).json({success:true, message: "user deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

const updateUser=async (req,res)=>{
    try{
        const {id,address,phone,email}=req.body;
        const user=await userModel.findById(id);
        if (!user){
            return res.status(400).json({error: "user not found"});
        }
        const updatedUser=await userModel.findByIdAndUpdate(id, {
            address,
            phone,
            email
        });
        res.status(200).json({success:true, message: "user updated successfully"});
        
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

const approveDyer=async (req,res)=>{
    try{
        const {id}=req.params;
        const user=await userModel.findById(id);
        if (!user){
            return res.status(400).json({error: "user not found"});
        }
        const updatedUser=await userModel.findByIdAndUpdate(id, {
            approved: true
        });
        res.status(200).json({success:true, message: "user approved successfully"});
        
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export { registerUser, loginUser, AdminLogin, getUser, getAllUsers, deleteUser, updateUser, approveDyer };



