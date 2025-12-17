"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginClient() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // Prevent double submission
        
        setLoading(true);
        try {
            const user = await login(email, password);
            
            if (!user) {
                throw new Error("Login failed. Please try again.");
            }
            
            toast.success("Logged in successfully");
            
            // Wait for cookie to be set and state to update
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Use window.location for reliable navigation that ensures middleware sees the cookie
            window.location.href = redirect;
        } catch (error) {
            toast.error(error.message || "Failed to sign in");
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <Card className="w-full max-w-md border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="space-y-4 flex flex-col items-center text-center pb-2">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="BrightSteps Logo"
                            width={180}
                            height={50}
                            className="h-12 w-auto object-contain mb-2"
                        />
                    </Link>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold tracking-tight text-white">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Enter your email to sign in to your account
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-200">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-gray-200">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-10 w-10 text-gray-400 hover:text-white hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">Toggle password visibility</span>
                                </Button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-transparent px-2 text-gray-400 font-medium tracking-wide backdrop-blur-xl">
                                New to BrightSteps?
                            </span>
                        </div>
                    </div>

                    <Link href="/register" className="block">
                        <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                            Create an account
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
