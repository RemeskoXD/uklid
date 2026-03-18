import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/admin");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F6] flex items-center justify-center p-6 font-sans selection:bg-[#E588A5] selection:text-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="http://web2.itnahodinu.cz/uklid/logo.webp" alt="Logo" className="h-24 w-auto mx-auto mb-6" referrerPolicy="no-referrer" />
          <h1 className="text-3xl font-serif text-[#2D2825] mb-2">Přihlášení</h1>
          <p className="font-sans text-xs uppercase tracking-widest text-[#E588A5] font-semibold">Administrace</p>
        </div>
        
        <div className="glass-card p-8 md:p-12">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-sans text-sm font-medium border border-red-100 text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-[#2D2825] font-semibold mb-2">E-mail (User Name)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-elegant"
                required
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-[#2D2825] font-semibold mb-2">Heslo</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-elegant"
                required
              />
            </div>
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className="btn-gold-wrapper"
              >
                <span className="btn-pink-inner">Přihlásit se</span>
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <a href="/" className="font-sans text-xs uppercase tracking-widest text-[#2D2825]/60 hover:text-[#E588A5] transition-colors font-semibold">
            &larr; Zpět na web
          </a>
        </div>
      </div>
    </div>
  );
}
