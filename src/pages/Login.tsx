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

  const inputClasses = "w-full px-4 py-3 bg-[#FAF7F2] border retro-border rounded-none focus:outline-none focus:bg-[#D0F0F0] transition-colors font-sans font-bold text-[#2A2522]";
  const labelClasses = "block font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D0F0F0] font-sans selection:bg-[#D9779B] selection:text-[#2A2522] px-6">
      <div className="max-w-md w-full p-10 bg-white retro-border retro-shadow">
        <div className="text-center mb-10">
          <img src="http://web2.itnahodinu.cz/uklid/logo.webp" alt="Logo" className="h-16 w-auto mx-auto mb-6" referrerPolicy="no-referrer" />
          <h2 className="text-3xl font-serif text-[#2A2522] font-bold">Přihlášení</h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D9779B] font-bold mt-2">Administrace</p>
        </div>
        
        {error && (
          <div className="bg-[#D9779B] border retro-border text-[#2A2522] px-4 py-3 mb-6 font-mono text-xs uppercase tracking-widest text-center font-bold">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className={labelClasses}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Heslo</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
              required
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#D9779B] text-[#2A2522] py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold retro-border retro-shadow-sm hover:bg-[#c9668a] transition-colors"
            >
              Přihlásit se
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold hover:text-[#D9779B] transition-colors border-b-2 border-transparent hover:border-[#D9779B]">
            &larr; Zpět na web
          </a>
        </div>
      </div>
    </div>
  );
}
