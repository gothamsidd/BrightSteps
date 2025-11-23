import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "Missing RESEND_API_KEY in Vercel Env Vars" }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: "Please provide an email query param: /api/test-email?email=your@email.com" }, { status: 400 });
    }

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
            to: email,
            subject: "Vercel Email Test",
            html: "<p>If you see this, email sending is working!</p>",
        });

        if (error) {
            return NextResponse.json({ status: "Failed", error }, { status: 500 });
        }

        return NextResponse.json({ status: "Success", data });
    } catch (err) {
        return NextResponse.json({ status: "Exception", message: err.message }, { status: 500 });
    }
}
