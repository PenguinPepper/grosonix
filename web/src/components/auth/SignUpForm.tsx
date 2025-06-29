"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import toast from "react-hot-toast";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        }
      );

      if (signUpError) throw signUpError;

      if (authData.user) {
        toast.success("Account created successfully!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(
        error.message || "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-silver">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md bg-midnight border border-silver/20 text-white focus:border-cyber-blue focus:ring focus:ring-cyber-blue/20 px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-silver">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md bg-midnight border border-silver/20 text-white focus:border-cyber-blue focus:ring focus:ring-cyber-blue/20 px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-silver">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 block w-full rounded-md bg-midnight border border-silver/20 text-white focus:border-cyber-blue focus:ring focus:ring-cyber-blue/20 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-electric-purple text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-purple disabled:opacity-50 transition-all">
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-silver">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-cyber-blue hover:text-opacity-80">
          Sign in
        </Link>
      </p>
    </form>
  );
}
