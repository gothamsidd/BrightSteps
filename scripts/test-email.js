const { Resend } = require("resend");
require("dotenv").config({ path: ".env" });

async function testEmail() {
    console.log("📧 Testing Resend Email...");

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("❌ RESEND_API_KEY is missing");
        return;
    }
    console.log("API Key found:", apiKey.substring(0, 5) + "...");

    const fromEmail = process.env.RESEND_FROM_EMAIL;
    console.log("From Email:", fromEmail);

    const resend = new Resend(apiKey);

    try {
        const data = await resend.emails.send({
            from: fromEmail,
            to: "sidd3j27@gmail.com", // Hardcoded for testing based on previous logs
            subject: "Test Email from BrightSteps",
            html: "<p>This is a test email to verify your Resend configuration.</p>",
        });

        console.log("✅ Email sent successfully!");
        console.log("Response:", data);
    } catch (error) {
        console.error("❌ Failed to send email:");
        console.error(error);
    }
}

testEmail();
