import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    console.log("Forgot Password API received request");
    try {
        const body = await req.json();
        const { email } = body;
        console.log("Request for email:", email);

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Check Env Vars
        if (!process.env.RESEND_API_KEY) {
            console.error("CRITICAL: RESEND_API_KEY is missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Find user by email
        console.log("Searching for user in DB...");
        const user = await db.user.findUnique({
            where: { email },
        });
        console.log("User search result:", user ? "Found" : "Not Found");

        if (!user) {
            return NextResponse.json({
                message: "If an account exists with this email, you will receive a password reset link.",
            });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token to database
        console.log("Updating user with reset token...");
        await db.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });
        console.log("User updated successfully");

        // Create reset link
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const resetLink = `${appUrl}/reset-password?token=${resetToken}`;
        console.log("Generated reset link for:", appUrl);

        // Send email using Resend
        try {
            console.log("Sending email via Resend...");
            const { data, error } = await resend.emails.send({
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

            if (error) {
                console.error("Resend API returned error:", error);
                // We log it but don't throw to user, unless we want to debug
            } else {
                console.log("Resend API success:", data);
            }
        } catch (emailError) {
            console.error("Resend execution error:", emailError);
        }

        return NextResponse.json({
            message: "If an account exists with this email, you will receive a password reset link.",
        });
    } catch (error) {
        console.error("Forgot password CRITICAL error:", error);
        return NextResponse.json(
            { error: "Failed to process request: " + error.message },
            { status: 500 }
        );
    }
}
