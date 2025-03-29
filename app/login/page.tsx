"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null); // Reset previous success message
    setError(""); // Reset error message

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Login Failed, Please enter correct email or password");
      return;
    } else {
      setSuccessMessage("Login successful!");

      // Delay navigation to allow user to see the success message
      setTimeout(() => {
        router.push("/");
      }, 1500); // Redirect after 1.5 seconds
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {successMessage ? (
        <div className="flex items-center bg-green-600 text-white p-3 rounded-md mb-4">
          <CheckCircle className="w-5 h-5 mr-2" />
          <p>{successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer"
          >
            Login
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <p className="text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              Register
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
