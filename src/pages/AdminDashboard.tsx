import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { LogOut, Calendar, Users, ClipboardList, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col md:flex-row font-sans selection:bg-[#D9779B] selection:text-[#2A2522]">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#D0F0F0] border-r retro-border flex flex-col z-10">
        <div className="p-8 border-b retro-border text-center bg-white">
          <img src="http://web2.itnahodinu.cz/uklid/logo.webp" alt="Logo" className="h-12 w-auto mx-auto mb-4" referrerPolicy="no-referrer" />
          <h2 className="text-xl font-serif text-[#2A2522] tracking-tight font-bold">Dočista s Káčou</h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#D9779B] font-bold mt-2">
            {user.name} <br/> ({user.role === 'admin' ? 'Administrátor' : 'Pracovník'})
          </p>
        </div>
        <nav className="flex-1 p-6 space-y-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold transition-colors ${activeTab === "orders" ? "bg-[#D9779B] text-[#2A2522] retro-border retro-shadow-sm" : "bg-white text-[#2A2522] hover:bg-[#D4B886] retro-border"}`}
          >
            <ClipboardList className="w-4 h-4" />
            Objednávky
          </button>
          {user.role === "admin" && (
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold transition-colors ${activeTab === "users" ? "bg-[#D9779B] text-[#2A2522] retro-border retro-shadow-sm" : "bg-white text-[#2A2522] hover:bg-[#D4B886] retro-border"}`}
            >
              <Users className="w-4 h-4" />
              Uživatelé
            </button>
          )}
          {user.role === "cleaner" && (
            <button
              onClick={() => setActiveTab("availability")}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold transition-colors ${activeTab === "availability" ? "bg-[#D9779B] text-[#2A2522] retro-border retro-shadow-sm" : "bg-white text-[#2A2522] hover:bg-[#D4B886] retro-border"}`}
            >
              <Calendar className="w-4 h-4" />
              Dostupnost
            </button>
          )}
        </nav>
        <div className="p-6 border-t retro-border bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 text-[#2A2522] hover:bg-[#D9779B] rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold transition-colors retro-border"
          >
            <LogOut className="w-4 h-4" />
            Odhlásit se
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-auto">
        {activeTab === "orders" && <OrdersView user={user} />}
        {activeTab === "users" && user.role === "admin" && <UsersView />}
        {activeTab === "availability" && user.role === "cleaner" && <AvailabilityView />}
      </main>
    </div>
  );
}

function OrdersView({ user }: { user: any }) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.ok) {
      setOrders(await res.json());
    }
  };

  const handleClaim = async (id: number) => {
    const res = await fetch(`/api/orders/${id}/claim`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.ok) {
      fetchOrders();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-2 block text-[#D9779B]">Přehled</span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#2A2522] font-bold">Objednávky</h1>
      </div>
      
      <div className="bg-white retro-border retro-shadow overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-sans text-[#2A2522] font-bold mb-2">Zatím žádné objednávky.</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold">Až přijdou, objeví se zde.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#D0F0F0] border-b retro-border">
                  <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">Zákazník</th>
                  <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">Služba</th>
                  <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">Termín</th>
                  <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">Stav</th>
                  <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y-3 divide-[#2A2522]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="p-6">
                      <div className="font-serif text-lg text-[#2A2522] mb-1 font-bold">{order.name}</div>
                      <div className="font-mono text-xs text-[#2A2522] mb-1 font-bold">{order.email}</div>
                      <div className="font-mono text-xs text-[#2A2522] mb-2 font-bold">{order.phone}</div>
                      <div className="text-sm text-gray-700 font-sans font-medium">{order.address}</div>
                    </td>
                    <td className="p-6">
                      <span className="inline-block border retro-border px-3 py-1 bg-white font-mono text-xs uppercase tracking-widest font-bold text-[#2A2522]">
                        {order.service_type}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="font-serif text-lg text-[#2A2522] mb-1 font-bold">{format(new Date(order.date), "d. M. yyyy", { locale: cs })}</div>
                      <div className="font-mono text-xs text-[#D9779B] uppercase tracking-widest font-bold">{order.time_slot}</div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center px-3 py-1 border retro-border font-mono text-[10px] uppercase tracking-widest font-bold ${
                        order.status === 'claimed' ? 'bg-[#D9779B] text-[#2A2522]' : 'bg-[#D0F0F0] text-[#2A2522]'
                      }`}>
                        {order.status === 'claimed' ? 'Přiřazeno' : 'Čeká'}
                      </span>
                    </td>
                    <td className="p-6">
                      {user.role === "cleaner" && order.status === "pending" && (
                        <button
                          onClick={() => handleClaim(order.id)}
                          className="flex items-center gap-2 bg-[#D4B886] retro-border text-[#2A2522] px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-[#D9779B] retro-shadow-sm transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Vzít si
                        </button>
                      )}
                      {order.status === "claimed" && order.claimed_by_user_id === user.id && (
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#D9779B] font-bold border-b-2 border-[#D9779B] pb-1">Moje zakázka</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "cleaner", priority: 1, has_car: false });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.ok) setUsers(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/users/${editingId}` : "/api/users";
    const method = editingId ? "PUT" : "POST";
    
    const res = await fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setFormData({ name: "", email: "", password: "", role: "cleaner", priority: 1, has_car: false });
      setEditingId(null);
      setShowForm(false);
      fetchUsers();
    }
  };

  const handleEdit = (user: any) => {
    setFormData({ 
      name: user.name, 
      email: user.email, 
      password: "", 
      role: user.role, 
      priority: user.priority || 1, 
      has_car: !!user.has_car 
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const inputClasses = "w-full px-4 py-3 bg-[#FAF7F2] border retro-border rounded-none focus:outline-none focus:bg-[#D0F0F0] transition-colors font-sans font-bold text-[#2A2522]";
  const labelClasses = "block font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold mb-2";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-2 block text-[#D9779B]">Správa</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2A2522] font-bold">Uživatelé</h1>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingId(null);
              setFormData({ name: "", email: "", password: "", role: "cleaner", priority: 1, has_car: false });
            } else {
              setShowForm(true);
            }
          }}
          className="bg-[#D9779B] text-[#2A2522] px-6 py-3 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold retro-border retro-shadow-sm hover:bg-[#c9668a] transition-colors"
        >
          {showForm ? "Zrušit" : "Přidat uživatele"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 md:p-12 retro-border retro-shadow mb-12">
          <h2 className="text-2xl font-serif mb-8 font-bold text-[#2A2522]">{editingId ? "Upravit uživatele" : "Nový uživatel"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelClasses}>Jméno</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClasses} required />
            </div>
            <div>
              <label className={labelClasses}>E-mail</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClasses} required />
            </div>
            <div>
              <label className={labelClasses}>{editingId ? "Nové heslo (nechte prázdné pro zachování)" : "Heslo"}</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className={inputClasses} required={!editingId} />
            </div>
            <div>
              <label className={labelClasses}>Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={`${inputClasses} appearance-none`}>
                <option value="cleaner">Pracovník (Cleaner)</option>
                <option value="admin">Administrátor</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Priorita (vyšší číslo = přednostní přidělování)</label>
              <input type="number" value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value) || 1})} className={inputClasses} required />
            </div>
            <div className="flex items-center gap-3 mt-8">
              <input type="checkbox" id="has_car" checked={formData.has_car} onChange={e => setFormData({...formData, has_car: e.target.checked})} className="w-5 h-5 accent-[#D9779B]" />
              <label htmlFor="has_car" className="font-mono text-xs uppercase tracking-widest text-[#2A2522] font-bold cursor-pointer">Má k dispozici auto (pro zakázky mimo Prahu)</label>
            </div>
            <div className="md:col-span-2 pt-4">
              <button type="submit" className="bg-[#D9779B] text-[#2A2522] px-8 py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold retro-border retro-shadow-sm hover:bg-[#c9668a] transition-colors">Uložit uživatele</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white retro-border retro-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#D0F0F0] border-b retro-border">
                <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">Jméno</th>
                <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">E-mail</th>
                <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">Role</th>
                <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">Priorita</th>
                <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">Auto</th>
                <th className="p-6 font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y-3 divide-[#2A2522]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="p-6 font-serif text-lg text-[#2A2522] font-bold">{u.name}</td>
                  <td className="p-6 font-mono text-xs text-[#2A2522] font-bold">{u.email}</td>
                  <td className="p-6">
                    <span className={`inline-flex items-center px-3 py-1 border retro-border font-mono text-[10px] uppercase tracking-widest font-bold ${
                      u.role === 'admin' ? 'bg-[#D4B886] text-[#2A2522]' : 'bg-white text-[#2A2522]'
                    }`}>
                      {u.role === 'admin' ? 'Admin' : 'Pracovník'}
                    </span>
                  </td>
                  <td className="p-6 font-mono text-xs text-[#2A2522] font-bold">{u.priority}</td>
                  <td className="p-6 font-mono text-xs text-[#2A2522] font-bold">{u.has_car ? "Ano" : "Ne"}</td>
                  <td className="p-6">
                    <button onClick={() => handleEdit(u)} className="text-[#D9779B] hover:text-[#c9668a] font-mono text-[10px] uppercase tracking-widest font-bold transition-colors">Upravit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AvailabilityView() {
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [timeSlot, setTimeSlot] = useState("08:00 - 12:00");

  const timeOptions = [
    "08:00 - 12:00",
    "12:00 - 16:00",
    "16:00 - 20:00",
    "Celý den (08:00 - 20:00)"
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    const res = await fetch("/api/availability");
    if (res.ok) {
      const data = await res.json();
      setSlots(data);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/availability", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ date: selectedDate, time_slot: timeSlot })
    });
    if (res.ok) {
      fetchAvailability();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/availability/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.ok) {
      fetchAvailability();
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-[#FAF7F2] border retro-border rounded-none focus:outline-none focus:bg-[#D0F0F0] transition-colors font-sans font-bold text-[#2A2522]";
  const labelClasses = "block font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold mb-2";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-2 block text-[#D9779B]">Plánování</span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#2A2522] font-bold">Moje dostupnost</h1>
      </div>
      
      <div className="bg-white p-8 md:p-12 retro-border retro-shadow mb-12">
        <h2 className="text-2xl font-serif mb-8 font-bold text-[#2A2522]">Přidat volný termín</h2>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className={labelClasses}>Datum</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)} 
              min={format(new Date(), "yyyy-MM-dd")}
              className={inputClasses} 
              required 
            />
          </div>
          <div className="flex-1 w-full">
            <label className={labelClasses}>Čas</label>
            <select 
              value={timeSlot} 
              onChange={e => setTimeSlot(e.target.value)} 
              className={`${inputClasses} appearance-none`}
            >
              {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full md:w-auto bg-[#D9779B] text-[#2A2522] px-8 py-3 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold retro-border retro-shadow-sm hover:bg-[#c9668a] transition-colors h-[48px]">
            Přidat
          </button>
        </form>
      </div>

      <div className="bg-white retro-border retro-shadow overflow-hidden">
        <div className="p-6 border-b retro-border bg-[#D0F0F0]">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold">Vypsané volné termíny</h3>
        </div>
        <ul className="divide-y-3 divide-[#2A2522]">
          {slots.length === 0 ? (
            <li className="p-12 text-center">
              <p className="font-sans text-[#2A2522] font-bold mb-2">Zatím nemáte vypsané žádné volné termíny.</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold">Přidejte je pomocí formuláře výše.</p>
            </li>
          ) : (
            slots.map(slot => (
              <li key={slot.id} className="p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-[#FAF7F2] transition-colors">
                <div>
                  <div className="font-serif text-xl text-[#2A2522] mb-1 font-bold">{format(new Date(slot.date), "EEEE, d. MMMM yyyy", { locale: cs })}</div>
                  <div className="font-mono text-xs text-[#D9779B] uppercase tracking-widest font-bold">{slot.time_slot}</div>
                </div>
                <button 
                  onClick={() => handleDelete(slot.id)}
                  className="self-start sm:self-auto border retro-border bg-white text-[#2A2522] hover:bg-[#D9779B] font-mono text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-full retro-shadow-sm transition-colors"
                >
                  Smazat
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
