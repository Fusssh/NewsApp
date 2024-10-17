import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function POST(req) {
    try {
        const { name, email, password } = await req.json();
        const hashedpassword = await bcrypt.hash(password,10)
        await connectMongoDB();
        await User.create({name,email,password:hashedpassword});

        return NextResponse.json({ message: "User registered" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'An error occurred while registering' }, { status: 500 }
        );
    }
}
