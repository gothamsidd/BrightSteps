import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

        // Create reset link
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

        // Send email using Resend
        try {
            console.log("Attempting to send email to:", email);
            console.log("Using API key:", process.env.RESEND_API_KEY ? "API key is set" : "API key is MISSING");
            console.log("From email:", process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev");

            const result = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
                to: email,
                subject: "Reset Your BrightSteps Password",
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Reset Your Password</h2>
            <p>You requested to reset your password for BrightSteps.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #6b7280; word-break: break-all;">${resetLink}</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This link will expire in 1 hour.</p>
            <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
            });

            console.log("✅ Password reset email sent successfully!");
            console.log("Email ID:", result.id);
        } catch (emailError) {
            console.error("❌ Failed to send email:");
            console.error("Error message:", emailError.message);
            console.error("Error details:", JSON.stringify(emailError, null, 2));
            // Still return success to user (don't reveal if email failed)
        }

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
