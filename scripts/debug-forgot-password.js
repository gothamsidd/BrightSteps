const { PrismaClient } = require("@prisma/client");
const { Resend } = require("resend");
const crypto = require("crypto");
require("dotenv").config({ path: ".env" });

const db = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function debugForgotPassword() {
    const email = "sidd3j27@gmail.com"; // The user's email
    console.log(`🔍 Debugging Forgot Password for: ${email}`);

    try {
        // 1. Check DB Connection & User
        console.log("1️⃣  Finding user in DB...");
        const user = await db.user.findUnique({ where: { email } });

        if (!user) {
            console.log("❌ User not found in DB. This would return 200 OK in the API (security).");
            return;
        }
        console.log("✅ User found:", user.id);

        // 2. Generate Token
        console.log("2️⃣  Generating token...");
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000);
        console.log("✅ Token generated");

        // 3. Update User in DB
        console.log("3️⃣  Updating user with token...");
        await db.user.update({
            where: { email },
            data: { resetToken, resetTokenExpiry },
        });
        console.log("✅ User updated in DB");

        // 4. Send Email
        console.log("4️⃣  Sending email...");
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
            to: email,
            subject: "Debug Reset Password",
            html: `<p>Debug link: ${resetLink}</p>`,
        });

        if (error) {
            console.error("❌ Resend Error:", error);
        } else {
            console.log("✅ Email sent:", data);
        }

    } catch (error) {
        console.error("❌ CRITICAL ERROR:");
        console.error(error);
    } finally {
        await db.$disconnect();
    }
}

debugForgotPassword();
