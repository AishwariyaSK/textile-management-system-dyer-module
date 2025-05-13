import  jwt  from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log("Decoded user:", decoded);
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }
    next();
};

const userMiddleware = (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(403).json({ success: false, message: "Access denied: Users only" });
    }
    next();
};

const allowRoles=(...roles)=>{
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)){
            return res.status(403).json({ success: false, message: "Access denied: Unauthorized role" });   
        }
        return next();
    }
}

export { authMiddleware, adminMiddleware, userMiddleware, allowRoles };