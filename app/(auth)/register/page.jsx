"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, User, Mail, Lock, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password);
            toast.success("Account created successfully");
            router.push("/dashboard");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            {/* Left Side - Branding */}
            <div className="hidden bg-muted lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
                    <div className="flex items-center text-lg font-medium">
                        <Image
                            src="/logo.svg"
                            alt="BrightSteps Logo"
                            width={150}
                            height={40}
                            className="brightness-0 invert"
                        />
                    </div>
                    <div className="space-y-6">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;I landed my dream job within weeks of using BrightSteps. The AI-powered resume optimization is a game changer.&rdquo;
                            </p>
                            <footer className="text-sm text-zinc-400">Alex Chen</footer>
                        </blockquote>
                        <div className="flex gap-4">
                            <div className="h-1 w-12 rounded-full bg-zinc-700" />
                            <div className="h-1 w-12 rounded-full bg-white" />
                            <div className="h-1 w-12 rounded-full bg-zinc-700" />
                        </div>
                    </div>
                </div>
                {/* Abstract Background Pattern */}
                <div className="absolute inset-0 z-10 opacity-20">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M100 0 C 80 100 50 100 0 0 Z" fill="white" />
                    </svg>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto w-full max-w-[350px] space-y-6 px-4">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details below to create your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Sign Up
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    <Link href="/login">
                        <Button variant="outline" className="w-full">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
