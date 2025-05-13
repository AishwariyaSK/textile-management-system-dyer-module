import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("MongoDB connected successfully");
    });

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/textile-management-system`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message, process.env.MONGODB_URI);
    }
};

export default connectDB;
