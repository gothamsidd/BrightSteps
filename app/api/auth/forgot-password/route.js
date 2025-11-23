import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if user exists or not (security best practice)
            return NextResponse.json({
                message: "If an account exists with this email, you will receive a password reset link.",
            });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token to database
        await db.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        // In development: log the reset link
        // In production: send email with this link
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

        console.log("=".repeat(60));
        console.log("PASSWORD RESET LINK:");
        console.log(resetLink);
        console.log("=".repeat(60));

        // TODO: In production, send email using Resend/SendGrid/etc.
        // await sendPasswordResetEmail(email, resetLink);

        return NextResponse.json({
            message: "If an account exists with this email, you will receive a password reset link.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
