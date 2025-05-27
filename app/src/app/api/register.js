import { connectToDatabase } from "../lib/mongoose";
import bcrypt from "bcryptjs"
import User from "../models/User";

export default async function handler(req, res){
    if(req.method !== "POST") return res.status(405).end();

    await connectToDatabase();

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({error: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User created", userId: user._id});
}