import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import handleError from "../middlewares/errors/handleError.js";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const SignUP = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    console.log("existingUser", existingUser);
    if (existingUser) {
      return handleError(res, null, "Email already exists", 409);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, {
      expiresIn: "1d",
    });
    return res.status(201).json({
      newUser,
      token,
    });
  } catch (error) {
    handleError(res, error, "Error in SignUp", 500);
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return handleError(res, null, "Invalid email or password", 400);
    }

    const isMatched = await bcrypt.compare(password, existingUser.password);
    if (!isMatched) {
      return handleError(res, null, "Invalid email or password", 401);
    }

    const token = jwt.sign(
      { id: existingUser._id, isAdmin: existingUser.isAdmin },
      SECRET_KEY,
      { expiresIn: "1d" }
    );
    const user = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
    };

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    handleError(res, error, "Error in Login", 500);
  }
};

export default {
  SignUP,
  Login,
};