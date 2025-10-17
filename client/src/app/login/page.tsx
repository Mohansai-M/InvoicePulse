"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "../Global/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true } 
      );
      setIsLoggedIn(true)
      router.push("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit" className="btn">
          Login
        </button>
      </form>
    </div>
  );
}
