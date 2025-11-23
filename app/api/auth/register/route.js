import { db } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Register API Hit. Body:", body);
        const { email, password, name } = body;

        if (!email || !password || !name) {
            console.log("Missing fields");
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log("Checking existing user...");
        try {
            const existingUser = await db.user.findUnique({
                where: { email },
            });
            console.log("Existing user check done. Result:", existingUser ? "Found" : "Not Found");

            if (existingUser) {
                console.log("User already exists");
                return NextResponse.json(
                    { error: "User already exists" },
                    { status: 400 }
                );
            }
        } catch (dbError) {
            console.error("DB Error during findUnique:", dbError);
            throw dbError;
        }

        console.log("Hashing password...");
        let hashedPassword;
        try {
            hashedPassword = await hashPassword(password);
            console.log("Password hashed");
        } catch (hashError) {
            console.error("Hash Error:", hashError);
            throw hashError;
        }

        console.log("Creating user in DB...");
        let user;
        try {
            user = await db.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });
            console.log("User created:", user.id);
        } catch (createError) {
            console.error("DB Create Error:", createError);
            throw createError;
        }

        console.log("Signing token...");
        const token = signToken({ userId: user.id, email: user.email });
        console.log("Token signed");

        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Registration error details:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
