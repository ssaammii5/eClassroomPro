"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Check, Eye, EyeOff, GraduationCap, Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

const FEATURES = [
    "Create and publish assignments",
    "Collect submissions with attachments",
    "Grade work and share feedback",
];

export function LoginView() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const clearError = (key: string) =>
        setErrors((prev) => {
            if (!prev[key]) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
        });

    const validate = () => {
        const next: Record<string, string> = {};
        if (!email.trim()) next.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
            next.email = "Enter a valid email address.";
        if (!password) next.password = "Password is required.";
        return next;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const next = validate();
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        setLoading(true);
        // Mock auth — replace with a real call to the backend AuthController later.
        window.setTimeout(() => {
            router.push("/");
        }, 900);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#eef1f4] px-4 py-8">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg lg:grid-cols-2">
                {/* ---------- Brand panel (blue) — stacks on top on mobile ---------- */}
                <div className="relative flex flex-col justify-between overflow-hidden bg-[#1a73e8] p-6 text-white sm:p-8 lg:p-10">
                    {/* Decorative emojis, same style as class banners */}
                    <span
                        aria-hidden
                        className="pointer-events-none absolute right-4 top-4 -rotate-12 text-5xl opacity-20 lg:right-8 lg:top-8 lg:text-7xl"
                    >
                        ✏️
                    </span>
                    <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-14 right-6 rotate-6 text-6xl opacity-20 lg:bottom-28 lg:right-14 lg:text-8xl"
                    >
                        📚
                    </span>
                    <span
                        aria-hidden
                        className="pointer-events-none absolute -left-3 bottom-4 rotate-12 text-5xl opacity-10 lg:-left-4 lg:bottom-8 lg:text-7xl"
                    >
                        🎓
                    </span>

                    {/* Logo */}
                    <div className="relative flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 lg:h-11 lg:w-11">
                            <GraduationCap className="h-6 w-6 lg:h-7 lg:w-7" />
                        </span>
                        <span className="text-xl font-medium lg:text-2xl">eClassroomPro</span>
                    </div>

                    {/* Headline */}
                    <div className="relative py-8 lg:py-0">
                        <h2 className="text-2xl font-semibold leading-tight lg:text-3xl">
                            One classroom for every role.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-white/85 lg:mt-3">
                            Role-based Assignment &amp; Submission Management System for
                            admins, teachers, and students.
                        </p>

                        {/* Feature list — desktop only */}
                        <ul className="mt-6 hidden space-y-3 text-sm text-white/90 lg:mt-8 lg:block">
                            {FEATURES.map((f) => (
                                <li key={f} className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                                        <Check className="h-3.5 w-3.5" />
                                    </span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer — desktop only */}
                    <p className="relative hidden text-xs text-white/70 lg:block">© 2026 eClassroomPro</p>
                </div>

                {/* ---------- Form panel ---------- */}
                <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14">
                    <h1 className="text-3xl text-gray-900">Sign in</h1>
                    <p className="mt-2 text-sm text-gray-700">to continue to eClassroomPro</p>

                    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                        {/* Email */}
                        <label className="block">
                            <span className="mb-1.5 block text-sm text-gray-800">
                                Email<span className="ml-0.5 text-[#c5221f]">*</span>
                            </span>
                            <input
                                type="email"
                                value={email}
                                autoComplete="email"
                                placeholder="you@example.com"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearError("email");
                                }}
                                className={`w-full rounded-md border bg-white px-3.5 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-600 focus:outline-none ${errors.email
                                        ? "border-[#c5221f] focus:border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                        : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                    }`}
                            />
                            {errors.email && (
                                <span className="mt-1 block text-sm text-[#c5221f]">{errors.email}</span>
                            )}
                        </label>

                        {/* Password */}
                        <label className="block">
                            <span className="mb-1.5 block text-sm text-gray-800">
                                Password<span className="ml-0.5 text-[#c5221f]">*</span>
                            </span>
                            <span className="relative block">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        clearError("password");
                                    }}
                                    className={`w-full rounded-md border bg-white px-3.5 py-2.5 pr-11 text-[15px] text-gray-900 placeholder:text-gray-600 focus:outline-none ${errors.password
                                            ? "border-[#c5221f] focus:border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                            : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                        }`}
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1.5 text-gray-600 hover:bg-gray-900/5"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </span>
                            {errors.password && (
                                <span className="mt-1 block text-sm text-[#c5221f]">{errors.password}</span>
                            )}
                        </label>

                        {/* Remember / forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="h-4 w-4 accent-[#1a73e8]"
                                />
                                Remember me
                            </label>
                            <a href="#" className="text-sm font-medium text-[#1a73e8] hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex cursor-pointer items-center gap-2 rounded-full bg-[#1a63d8] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1554b5] disabled:cursor-default disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <LogIn className="h-4 w-4" />
                                )}
                                {loading ? "Signing in…" : "Sign in"}
                            </button>
                        </div>
                    </form>

                    {/* Legal */}
                    <div className="mt-10 flex items-center justify-center gap-2 text-xs text-gray-700">
                        <a href="#" className="hover:underline">
                            Privacy Policy
                        </a>
                        <span>•</span>
                        <a href="#" className="hover:underline">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}