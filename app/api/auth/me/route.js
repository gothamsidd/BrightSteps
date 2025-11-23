import { getSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ user: null });
        }

        const user = await db.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                name: true,
                imageUrl: true,
                industry: true,
            },
        });

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ user: null });
    }
}
