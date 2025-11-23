"use client";

import { Suspense } from "react";
import LoginClient from "./login-client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginClient />
        </Suspense>
    );
}
