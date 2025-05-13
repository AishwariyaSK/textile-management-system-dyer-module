import e, { Router } from "express";
import { registerUser, loginUser, AdminLogin, getUser, getAllUsers, deleteUser, updateUser, approveDyer } from "../controllers/userController.js";
import { authMiddleware, adminMiddleware, userMiddleware, allowRoles } from "../middleware/auth.js";

const userRouter=Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin/login', AdminLogin); // Admin 

userRouter.get('/getUser/:id', authMiddleware, getUser); //both
userRouter.get('/getAllUsers', authMiddleware,adminMiddleware, getAllUsers); //admin
userRouter.delete('/deleteUser/:id', authMiddleware,adminMiddleware, deleteUser); //admin
userRouter.patch('/updateUser', authMiddleware, updateUser); 

userRouter.patch('/approveDyer/:id', authMiddleware, adminMiddleware, approveDyer); //admin

export default userRouter;