"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [signOutMessage, setSignOutMessage] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      setSignOutMessage("Successfully signed out!");
      setMenuOpen(false);

      // Optionally, you can redirect after a short delay
      setTimeout(() => {
        setSignOutMessage(null);
        window.location.href = "/"; // Redirect to home page
      }, 1500);
    } catch (error) {
      console.log(error);
      setError("Failed to sign out");
    }
  };

  return (
    <div className="bg-gray-800 text-white sticky top-0 z-40 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold"
          prefetch={true}
        >
          <Home className="w-5 h-5" />
          ImageKit ReelsPro
        </Link>

        <div className="relative">
          {status === "authenticated" && (
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <User className="w-5 h-5" />
            </button>
          )}

          {menuOpen && (
            <div className="absolute right-0 mt-4 w-64 bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-2 text-sm text-gray-600">
                {session?.user?.email?.split("@")[0]}
              </div>
              <hr className="border-gray-300" />
              <Link
                href="/upload"
                className="block px-4 py-2 text-sm hover:bg-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                Video Upload
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-200 cursor-pointer"
              >
                Sign Out
              </button>
              {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Show sign-out message */}
      {signOutMessage && (
        <div className="fixed top-16 right-4 bg-green-600 text-white p-3 rounded-md flex items-center shadow-lg">
          <CheckCircle className="w-5 h-5 mr-2" />
          <p>{signOutMessage}</p>
        </div>
      )}
    </div>
  );
}
