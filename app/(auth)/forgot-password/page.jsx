"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import ForgotPasswordClient from "./forgot-password-client";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ForgotPasswordClient />
        </Suspense>
    );
}
