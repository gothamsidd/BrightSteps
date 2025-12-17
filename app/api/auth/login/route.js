import { db } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return NextResponse.json(
                { error: "No account found with this email. Please sign up first." },
                { status: 401 }
            );
        }

        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials. Please check your password." },
                { status: 401 }
            );
        }

        const token = signToken({ userId: user.id, email: user.email });

        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
