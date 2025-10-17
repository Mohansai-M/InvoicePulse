"use client";
import { useRouter } from "next/navigation";
import {AuthContext} from '../Global/AuthContext'
import { useContext } from "react";
import axios from "axios";

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const logout = async () => {
      try {
        await axios.post("http://localhost:5000/api/auth/logout");
         setIsLoggedIn(false);
        alert("Logged out successfully");
      } catch (err: any) {
        alert(err.response?.data?.message || "Logout failed");
      }
    };

  const router = useRouter();

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => {
          router.push("/")
        }}
      >
        InvoiceApp
      </div>

      <div className="space-x-2">
        {isLoggedIn === false ? (
          <>
            <button
              className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
            <button
              className="px-3 py-1 bg-green-500 rounded hover:bg-green-600"
              onClick={() => router.push("/signup")}
            >
              Signup
            </button>
          </>
        ) : (
          <>
            <button
              className="px-3 py-1 bg-blue-900 rounded hover:bg-green-600 text-white"
              onClick={() => router.push("/FetchInvoices")}
            >
              Fetch Invoices
            </button>
            <button
              onClick={logout}
              className="ml-2 px-3 py-1 bg-red-700 text-white rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
