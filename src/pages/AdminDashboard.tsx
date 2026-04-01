import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { format, startOfWeek, addDays, isBefore, startOfDay } from "date-fns";
import { cs } from "date-fns/locale";
import { LogOut, Calendar, Users, ClipboardList, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

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
            <>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold transition-colors ${activeTab === "users" ? "bg-[#D9779B] text-[#2A2522] retro-border retro-shadow-sm" : "bg-white text-[#2A2522] hover:bg-[#D4B886] retro-border"}`}
              >
                <Users className="w-4 h-4" />
                Uživatelé
              </button>
              <button
                onClick={() => setActiveTab("admin-availability")}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold transition-colors ${activeTab === "admin-availability" ? "bg-[#D9779B] text-[#2A2522] retro-border retro-shadow-sm" : "bg-white text-[#2A2522] hover:bg-[#D4B886] retro-border"}`}
              >
                <Calendar className="w-4 h-4" />
                Směny
              </button>
            </>
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
        {activeTab === "admin-availability" && user.role === "admin" && <AdminAvailabilityView />}
        {activeTab === "availability" && user.role === "cleaner" && <AvailabilityView />}
      </main>
    </div>
  );
}

function OrdersView({ user }: { user: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

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

  const handleStatusChange = async (id: number, status: string) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      fetchOrders();
    }
  };

  const filteredOrders = orders
    .filter(o => statusFilter === "all" || o.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new': return <span className="inline-flex items-center px-3 py-1 border retro-border font-mono text-[10px] uppercase tracking-widest font-bold bg-[#D0F0F0] text-[#2A2522]">Nové</span>;
      case 'confirmed': return <span className="inline-flex items-center px-3 py-1 border retro-border font-mono text-[10px] uppercase tracking-widest font-bold bg-[#D9779B] text-white">Potvrzeno</span>;
      case 'done': return <span className="inline-flex items-center px-3 py-1 border retro-border font-mono text-[10px] uppercase tracking-widest font-bold bg-[#D4B886] text-[#2A2522]">Hotovo</span>;
      case 'cancelled': return <span className="inline-flex items-center px-3 py-1 border retro-border font-mono text-[10px] uppercase tracking-widest font-bold bg-gray-300 text-gray-700">Storno</span>;
      default: return <span className="inline-flex items-center px-3 py-1 border retro-border font-mono text-[10px] uppercase tracking-widest font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-2 block text-[#D9779B]">Přehled</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2A2522] font-bold">Objednávky</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold mb-1">Stav</label>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-white border retro-border px-3 py-2 text-sm font-sans focus:outline-none rounded-none"
            >
              <option value="all">Všechny</option>
              <option value="new">Nové</option>
              <option value="confirmed">Potvrzeno</option>
              <option value="done">Hotovo</option>
              <option value="cancelled">Storno</option>
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold mb-1">Řazení</label>
            <select 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value as any)}
              className="bg-white border retro-border px-3 py-2 text-sm font-sans focus:outline-none rounded-none"
            >
              <option value="newest">Nejnovější</option>
              <option value="oldest">Nejstarší</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white retro-border retro-shadow overflow-hidden">
        {filteredOrders.length === 0 ? (
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="p-6">
                      <div className="font-serif text-lg text-[#2A2522] mb-1 font-bold">{order.name}</div>
                      <div className="font-mono text-xs text-[#2A2522] mb-1 font-bold">{order.email}</div>
                      <div className="font-mono text-xs text-[#2A2522] mb-2 font-bold">{order.phone}</div>
                      <div className="text-sm text-gray-700 font-sans font-medium">{order.address}</div>
                      {order.note && (
                        <div className="mt-3 p-3 bg-[#FCF9F6] border border-[#D4B886]/30 rounded text-sm font-sans text-[#2A2522]">
                          <strong className="font-mono text-[10px] uppercase tracking-widest text-[#D9779B] block mb-1">Poznámka:</strong>
                          {order.note}
                        </div>
                      )}
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
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-2">
                        {user.role === "cleaner" && order.status === "new" && (
                          <button
                            onClick={() => handleClaim(order.id)}
                            className="flex items-center justify-center gap-2 bg-[#D4B886] retro-border text-[#2A2522] px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-[#D9779B] hover:text-white retro-shadow-sm transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Vzít si
                          </button>
                        )}
                        
                        {(user.role === "admin" || (user.role === "cleaner" && order.claimed_by_user_id === user.id)) && (
                          <>
                            {order.status === "new" && user.role === "admin" && (
                              <button
                                onClick={() => handleStatusChange(order.id, 'confirmed')}
                                className="bg-[#D9779B] text-white retro-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-[#c26284] transition-colors"
                              >
                                Potvrdit
                              </button>
                            )}
                            {(order.status === "new" || order.status === "confirmed") && (
                              <button
                                onClick={() => handleStatusChange(order.id, 'done')}
                                className="bg-[#D4B886] text-[#2A2522] retro-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-[#c2a673] transition-colors"
                              >
                                Hotovo
                              </button>
                            )}
                            {order.status !== "cancelled" && order.status !== "done" && (
                              <button
                                onClick={() => {
                                  if (window.confirm('Opravdu chcete stornovat tuto objednávku? Zákazníkovi bude odeslán e-mail.')) {
                                    handleStatusChange(order.id, 'cancelled');
                                  }
                                }}
                                className="bg-white text-red-600 border border-red-200 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-red-50 transition-colors"
                              >
                                Storno
                              </button>
                            )}
                          </>
                        )}
                      </div>
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

function AdminAvailabilityView() {
  const [slots, setSlots] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedUserId, setSelectedUserId] = useState<number | "all">("all");
  const [customTimeDay, setCustomTimeDay] = useState<string | null>(null);
  const [customStart, setCustomStart] = useState("08:00");
  const [customEnd, setCustomEnd] = useState("16:00");
  const [customType, setCustomType] = useState<"availability" | "break">("availability");

  const timeOptions = [
    "08:00 - 12:00",
    "12:00 - 16:00",
    "16:00 - 20:00",
    "Celý den (08:00 - 20:00)"
  ];

  useEffect(() => {
    fetchUsers();
    fetchAvailability();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data.filter((u: any) => u.role === "cleaner"));
    }
  };

  const fetchAvailability = async () => {
    const res = await fetch("/api/admin/availability", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.ok) {
      setSlots(await res.json());
    }
  };

  const toggleSlot = async (dateStr: string, timeSlot: string, userId: number) => {
    const existingSlot = slots.find(s => s.date === dateStr && s.time_slot === timeSlot && s.user_id === userId);
    
    if (existingSlot) {
      // Delete
      const res = await fetch(`/api/admin/availability/${existingSlot.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) fetchAvailability();
    } else {
      // Add
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ user_id: userId, date: dateStr, time_slot: timeSlot })
      });
      if (res.ok) fetchAvailability();
    }
  };

  const handleAddCustom = async (dateStr: string, userId: number) => {
    if (!customStart || !customEnd) return;
    
    if (customStart >= customEnd) {
      alert("Konec musí být po začátku.");
      return;
    }

    if (customType === "availability") {
      const timeSlot = `${customStart} - ${customEnd}`;
      
      if (slots.find(s => s.date === dateStr && s.time_slot === timeSlot && s.user_id === userId)) {
        setCustomTimeDay(null);
        return;
      }

      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ user_id: userId, date: dateStr, time_slot: timeSlot })
      });
      if (res.ok) {
        fetchAvailability();
        setCustomTimeDay(null);
        setCustomStart("08:00");
        setCustomEnd("16:00");
      }
    } else if (customType === "break") {
      const bStart = customStart;
      const bEnd = customEnd;
      const daySlots = slots.filter(s => s.date === dateStr && s.user_id === userId);
      let changed = false;

      for (const slot of daySlots) {
        const match = slot.time_slot.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        if (!match) continue;
        
        const sStart = match[1];
        const sEnd = match[2];
        
        if (bStart < sEnd && bEnd > sStart) {
          changed = true;
          await fetch(`/api/admin/availability/${slot.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          
          if (sStart < bStart) {
            await fetch("/api/admin/availability", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
              },
              body: JSON.stringify({ user_id: userId, date: dateStr, time_slot: `${sStart} - ${bStart}` })
            });
          }
          
          if (bEnd < sEnd) {
            await fetch("/api/admin/availability", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
              },
              body: JSON.stringify({ user_id: userId, date: dateStr, time_slot: `${bEnd} - ${sEnd}` })
            });
          }
        }
      }
      
      if (changed) {
        fetchAvailability();
      }
      setCustomTimeDay(null);
      setCustomStart("08:00");
      setCustomEnd("16:00");
      setCustomType("availability");
    }
  };

  const days = Array.from({ length: 14 }).map((_, i) => addDays(weekStart, i));
  const today = startOfDay(new Date());
  
  const displayedUsers = selectedUserId === "all" ? users : users.filter(u => u.id === selectedUserId);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-2 block text-[#D9779B]">Plánování</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2A2522] font-bold">Směny pracovníků</h1>
        </div>
        <div className="w-full md:w-64">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold mb-2">Filtrovat pracovníka</label>
          <select 
            value={selectedUserId} 
            onChange={(e) => setSelectedUserId(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="w-full px-4 py-3 bg-white border retro-border rounded-none focus:outline-none focus:bg-[#D0F0F0] transition-colors font-sans font-bold text-[#2A2522] appearance-none"
          >
            <option value="all">Všichni pracovníci</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="bg-white retro-border retro-shadow overflow-hidden mb-12">
        <div className="p-6 border-b retro-border bg-[#D0F0F0] flex items-center justify-between">
          <button 
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="p-2 hover:bg-white rounded-full transition-colors retro-border bg-white"
          >
            <ChevronLeft className="w-5 h-5 text-[#2A2522]" />
          </button>
          <h3 className="font-mono text-sm uppercase tracking-widest text-[#2A2522] font-bold text-center">
            {format(weekStart, "d. MMMM", { locale: cs })} - {format(addDays(weekStart, 13), "d. MMMM yyyy", { locale: cs })}
          </h3>
          <button 
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="p-2 hover:bg-white rounded-full transition-colors retro-border bg-white"
          >
            <ChevronRight className="w-5 h-5 text-[#2A2522]" />
          </button>
        </div>
        
        <div className="divide-y-3 divide-[#2A2522]">
          {days.map(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isPast = isBefore(day, today);
            const isToday = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
            
            return (
              <div key={dateStr} className={`p-6 flex flex-col lg:flex-row lg:items-start gap-6 ${isPast ? 'bg-gray-50 opacity-60' : 'hover:bg-[#FAF7F2]'} transition-colors`}>
                <div className="lg:w-48 shrink-0 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="font-serif text-xl text-[#2A2522] font-bold">
                      {format(day, "EEEE", { locale: cs })}
                    </div>
                    {isToday && <span className="bg-[#D9779B] text-white text-[8px] px-2 py-0.5 rounded-full font-mono uppercase tracking-widest font-bold">Dnes</span>}
                  </div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">
                    {format(day, "d. M. yyyy")}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col gap-6">
                  {displayedUsers.length === 0 && (
                    <div className="text-sm text-gray-500 font-mono">Žádní pracovníci k zobrazení.</div>
                  )}
                  {displayedUsers.map(u => {
                    const userSlots = slots.filter(s => s.date === dateStr && s.user_id === u.id);
                    const customSlots = userSlots.filter(s => !timeOptions.includes(s.time_slot));
                    
                    return (
                      <div key={u.id} className="flex flex-col md:flex-row md:items-start gap-4 border-l-4 border-[#D0F0F0] pl-4">
                        <div className="md:w-32 shrink-0 pt-2 font-sans font-bold text-[#2A2522] text-sm">
                          {u.name}
                        </div>
                        <div className="flex-1 flex flex-wrap gap-2">
                          {timeOptions.map(time => {
                            const slot = userSlots.find(s => s.time_slot === time);
                            const isSelected = !!slot;
                            const isBooked = slot?.is_booked === 1;
                            
                            return (
                              <button
                                key={time}
                                disabled={isPast || isBooked}
                                onClick={() => toggleSlot(dateStr, time, u.id)}
                                className={`
                                  relative px-3 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold transition-all border-2
                                  ${isSelected 
                                    ? isBooked 
                                      ? 'bg-[#2A2522] text-white border-[#2A2522] cursor-not-allowed' 
                                      : 'bg-[#D9779B] text-white border-[#D9779B] hover:bg-[#c9668a] hover:border-[#c9668a] retro-shadow-sm'
                                    : 'bg-white text-[#2A2522] border-[#D4AF37]/30 hover:border-[#D9779B] hover:text-[#D9779B]'
                                  }
                                  ${isPast && !isSelected ? 'cursor-not-allowed opacity-50' : ''}
                                `}
                              >
                                {time}
                                {isBooked && <span className="absolute -top-2 -right-2 bg-[#D4B886] text-[#2A2522] text-[8px] px-2 py-1 rounded-full border retro-border">Obsazeno</span>}
                              </button>
                            );
                          })}

                          {customSlots.map(slot => {
                            const isBooked = slot.is_booked === 1;
                            return (
                              <button
                                key={slot.id}
                                disabled={isPast || isBooked}
                                onClick={() => toggleSlot(dateStr, slot.time_slot, u.id)}
                                className={`
                                  relative px-3 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold transition-all border-2
                                  ${isBooked 
                                    ? 'bg-[#2A2522] text-white border-[#2A2522] cursor-not-allowed' 
                                    : 'bg-[#D9779B] text-white border-[#D9779B] hover:bg-[#c9668a] hover:border-[#c9668a] retro-shadow-sm'
                                  }
                                `}
                              >
                                {slot.time_slot}
                                {isBooked && <span className="absolute -top-2 -right-2 bg-[#D4B886] text-[#2A2522] text-[8px] px-2 py-1 rounded-full border retro-border">Obsazeno</span>}
                              </button>
                            );
                          })}

                          {!isPast && (
                            customTimeDay === `${dateStr}-${u.id}` ? (
                              <div className="flex flex-col gap-2 bg-[#D0F0F0] p-2 rounded-lg border retro-border retro-shadow-sm w-full max-w-xs">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setCustomType("availability")}
                                    className={`flex-1 py-1 rounded font-mono text-[8px] uppercase tracking-widest font-bold border retro-border transition-colors ${customType === "availability" ? "bg-[#D9779B] text-white" : "bg-white text-[#2A2522]"}`}
                                  >
                                    Dostupnost
                                  </button>
                                  <button
                                    onClick={() => setCustomType("break")}
                                    className={`flex-1 py-1 rounded font-mono text-[8px] uppercase tracking-widest font-bold border retro-border transition-colors ${customType === "break" ? "bg-[#D4B886] text-[#2A2522]" : "bg-white text-[#2A2522]"}`}
                                  >
                                    Přestávka
                                  </button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <input 
                                    type="time" 
                                    value={customStart} 
                                    onChange={e => setCustomStart(e.target.value)} 
                                    className="flex-1 bg-white border retro-border px-1 py-1 text-[10px] font-mono focus:outline-none rounded" 
                                  />
                                  <span className="font-bold text-[#2A2522]">-</span>
                                  <input 
                                    type="time" 
                                    value={customEnd} 
                                    onChange={e => setCustomEnd(e.target.value)} 
                                    className="flex-1 bg-white border retro-border px-1 py-1 text-[10px] font-mono focus:outline-none rounded" 
                                  />
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <button 
                                    onClick={() => handleAddCustom(dateStr, u.id)} 
                                    className="flex-1 bg-[#2A2522] text-white py-1 rounded text-[8px] uppercase tracking-widest font-bold retro-border hover:bg-black transition-colors"
                                  >
                                    Přidat
                                  </button>
                                  <button 
                                    onClick={() => setCustomTimeDay(null)} 
                                    className="px-2 py-1 bg-white text-[#2A2522] rounded text-[8px] uppercase tracking-widest font-bold retro-border hover:bg-gray-50 transition-colors"
                                  >
                                    Zrušit
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setCustomTimeDay(`${dateStr}-${u.id}`)} 
                                className="px-3 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold border-2 border-dashed border-[#2A2522]/30 text-[#2A2522]/60 hover:border-[#D9779B] hover:text-[#D9779B] transition-colors"
                              >
                                + Vlastní
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AvailabilityView() {
  const [slots, setSlots] = useState<any[]>([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [customTimeDay, setCustomTimeDay] = useState<string | null>(null);
  const [customStart, setCustomStart] = useState("08:00");
  const [customEnd, setCustomEnd] = useState("16:00");
  const [customType, setCustomType] = useState<"availability" | "break">("availability");

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
    const res = await fetch("/api/my-availability", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.ok) {
      setSlots(await res.json());
    }
  };

  const toggleSlot = async (dateStr: string, timeSlot: string) => {
    const existingSlot = slots.find(s => s.date === dateStr && s.time_slot === timeSlot);
    
    if (existingSlot) {
      // Delete
      const res = await fetch(`/api/availability/${existingSlot.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) fetchAvailability();
    } else {
      // Add
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ date: dateStr, time_slot: timeSlot })
      });
      if (res.ok) fetchAvailability();
    }
  };

  const handleAddCustom = async (dateStr: string) => {
    if (!customStart || !customEnd) return;
    
    if (customStart >= customEnd) {
      alert("Konec musí být po začátku.");
      return;
    }

    if (customType === "availability") {
      const timeSlot = `${customStart} - ${customEnd}`;
      
      // Check if already exists
      if (slots.find(s => s.date === dateStr && s.time_slot === timeSlot)) {
        setCustomTimeDay(null);
        return;
      }

      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ date: dateStr, time_slot: timeSlot })
      });
      if (res.ok) {
        fetchAvailability();
        setCustomTimeDay(null);
        setCustomStart("08:00");
        setCustomEnd("16:00");
      }
    } else if (customType === "break") {
      const bStart = customStart;
      const bEnd = customEnd;
      const daySlots = slots.filter(s => s.date === dateStr);
      let changed = false;

      for (const slot of daySlots) {
        // Parse the slot times using regex to handle formats like "Celý den (08:00 - 20:00)"
        const match = slot.time_slot.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        if (!match) continue;
        
        const sStart = match[1];
        const sEnd = match[2];
        
        // Check for overlap
        if (bStart < sEnd && bEnd > sStart) {
          changed = true;
          // 1. Delete the original slot
          await fetch(`/api/availability/${slot.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          
          // 2. Create left part if needed
          if (sStart < bStart) {
            await fetch("/api/availability", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
              },
              body: JSON.stringify({ date: dateStr, time_slot: `${sStart} - ${bStart}` })
            });
          }
          
          // 3. Create right part if needed
          if (bEnd < sEnd) {
            await fetch("/api/availability", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
              },
              body: JSON.stringify({ date: dateStr, time_slot: `${bEnd} - ${sEnd}` })
            });
          }
        }
      }
      
      if (changed) {
        fetchAvailability();
      }
      setCustomTimeDay(null);
      setCustomStart("08:00");
      setCustomEnd("16:00");
      setCustomType("availability");
    }
  };

  const days = Array.from({ length: 14 }).map((_, i) => addDays(weekStart, i));
  const today = startOfDay(new Date());

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-2 block text-[#D9779B]">Plánování</span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#2A2522] font-bold">Moje dostupnost</h1>
        <p className="mt-4 font-sans text-gray-600 font-medium">Vyberte dny a časy, kdy můžete pracovat. Kliknutím na časový blok jej přidáte nebo odeberete. Pro přidání přestávky použijte tlačítko "+ Vlastní čas / Přestávka" a zvolte záložku "Přestávka", systém automaticky rozdělí vaši pracovní dobu.</p>
      </div>
      
      <div className="bg-white retro-border retro-shadow overflow-hidden mb-12">
        <div className="p-6 border-b retro-border bg-[#D0F0F0] flex items-center justify-between">
          <button 
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="p-2 hover:bg-white rounded-full transition-colors retro-border bg-white"
          >
            <ChevronLeft className="w-5 h-5 text-[#2A2522]" />
          </button>
          <h3 className="font-mono text-sm uppercase tracking-widest text-[#2A2522] font-bold text-center">
            {format(weekStart, "d. MMMM", { locale: cs })} - {format(addDays(weekStart, 13), "d. MMMM yyyy", { locale: cs })}
          </h3>
          <button 
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="p-2 hover:bg-white rounded-full transition-colors retro-border bg-white"
          >
            <ChevronRight className="w-5 h-5 text-[#2A2522]" />
          </button>
        </div>
        
        <div className="divide-y-3 divide-[#2A2522]">
          {days.map(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isPast = isBefore(day, today);
            const isToday = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
            
            const daySlots = slots.filter(s => s.date === dateStr);
            const customSlots = daySlots.filter(s => !timeOptions.includes(s.time_slot));
            
            return (
              <div key={dateStr} className={`p-6 flex flex-col md:flex-row md:items-start gap-6 ${isPast ? 'bg-gray-50 opacity-60' : 'hover:bg-[#FAF7F2]'} transition-colors`}>
                <div className="md:w-48 shrink-0 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="font-serif text-xl text-[#2A2522] font-bold">
                      {format(day, "EEEE", { locale: cs })}
                    </div>
                    {isToday && <span className="bg-[#D9779B] text-white text-[8px] px-2 py-0.5 rounded-full font-mono uppercase tracking-widest font-bold">Dnes</span>}
                  </div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">
                    {format(day, "d. M. yyyy")}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-wrap gap-3">
                  {timeOptions.map(time => {
                    const slot = daySlots.find(s => s.time_slot === time);
                    const isSelected = !!slot;
                    const isBooked = slot?.is_booked === 1;
                    
                    return (
                      <button
                        key={time}
                        disabled={isPast || isBooked}
                        onClick={() => toggleSlot(dateStr, time)}
                        className={`
                          relative px-4 py-3 rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold transition-all border-2
                          ${isSelected 
                            ? isBooked 
                              ? 'bg-[#2A2522] text-white border-[#2A2522] cursor-not-allowed' 
                              : 'bg-[#D9779B] text-white border-[#D9779B] hover:bg-[#c9668a] hover:border-[#c9668a] retro-shadow-sm'
                            : 'bg-white text-[#2A2522] border-[#D4AF37]/30 hover:border-[#D9779B] hover:text-[#D9779B]'
                          }
                          ${isPast && !isSelected ? 'cursor-not-allowed opacity-50' : ''}
                        `}
                      >
                        {time}
                        {isBooked && <span className="absolute -top-2 -right-2 bg-[#D4B886] text-[#2A2522] text-[8px] px-2 py-1 rounded-full border retro-border">Obsazeno</span>}
                      </button>
                    );
                  })}

                  {customSlots.map(slot => {
                    const isBooked = slot.is_booked === 1;
                    return (
                      <button
                        key={slot.id}
                        disabled={isPast || isBooked}
                        onClick={() => toggleSlot(dateStr, slot.time_slot)}
                        className={`
                          relative px-4 py-3 rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold transition-all border-2
                          ${isBooked 
                            ? 'bg-[#2A2522] text-white border-[#2A2522] cursor-not-allowed' 
                            : 'bg-[#D9779B] text-white border-[#D9779B] hover:bg-[#c9668a] hover:border-[#c9668a] retro-shadow-sm'
                          }
                        `}
                      >
                        {slot.time_slot}
                        {isBooked && <span className="absolute -top-2 -right-2 bg-[#D4B886] text-[#2A2522] text-[8px] px-2 py-1 rounded-full border retro-border">Obsazeno</span>}
                      </button>
                    );
                  })}

                  {!isPast && (
                    customTimeDay === dateStr ? (
                      <div className="flex flex-col gap-2 bg-[#D0F0F0] p-3 rounded-xl border retro-border retro-shadow-sm w-full max-w-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCustomType("availability")}
                            className={`flex-1 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold border retro-border transition-colors ${customType === "availability" ? "bg-[#D9779B] text-white" : "bg-white text-[#2A2522]"}`}
                          >
                            Dostupnost
                          </button>
                          <button
                            onClick={() => setCustomType("break")}
                            className={`flex-1 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold border retro-border transition-colors ${customType === "break" ? "bg-[#D4B886] text-[#2A2522]" : "bg-white text-[#2A2522]"}`}
                          >
                            Přestávka
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="time" 
                            value={customStart} 
                            onChange={e => setCustomStart(e.target.value)} 
                            className="flex-1 bg-white border retro-border px-2 py-1.5 text-xs font-mono focus:outline-none rounded-lg" 
                          />
                          <span className="font-bold text-[#2A2522]">-</span>
                          <input 
                            type="time" 
                            value={customEnd} 
                            onChange={e => setCustomEnd(e.target.value)} 
                            className="flex-1 bg-white border retro-border px-2 py-1.5 text-xs font-mono focus:outline-none rounded-lg" 
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button 
                            onClick={() => handleAddCustom(dateStr)} 
                            className="flex-1 bg-[#2A2522] text-white py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold retro-border hover:bg-black transition-colors"
                          >
                            Přidat
                          </button>
                          <button 
                            onClick={() => setCustomTimeDay(null)} 
                            className="px-3 py-1.5 bg-white text-[#2A2522] rounded-lg text-[10px] uppercase tracking-widest font-bold retro-border hover:bg-gray-50 transition-colors"
                          >
                            Zrušit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setCustomTimeDay(dateStr)} 
                        className="px-4 py-3 rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold border-2 border-dashed border-[#2A2522]/30 text-[#2A2522]/60 hover:border-[#D9779B] hover:text-[#D9779B] transition-colors"
                      >
                        + Vlastní čas / Přestávka
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
