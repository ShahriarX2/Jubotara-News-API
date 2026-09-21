import app from "./src/app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

if (!process.env.MONGO_URI) {
    console.error("Warning: MONGO_URI environment variable is not defined!");
} else {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("DB connected");
        })
        .catch(err => {
            console.error("MongoDB connection error:", err);
        });
}