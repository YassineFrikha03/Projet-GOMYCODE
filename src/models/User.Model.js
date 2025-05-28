import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        match: /.+\@.+\..+/ ,// Validate email format
        lowerCase : true, // Convert email to lowercase
        validator: (value) => validator.isEmail(value), // Use validator to check if it's a valid email
    },
    password: {
        type: String,
        required: true,
        minlength: 6 ,
        validator: (value) => (value && value.length >= 6) // Ensure password is at least 6 characters long
    },
    isAdmin: {
        type: Boolean,
        default: false 
    }
});
// Create and export the model
export default mongoose.model("User", userSchema);