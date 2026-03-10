import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Check, ChevronRight, MapPin, Phone, Mail, Instagram, Star, Shield, Clock } from "lucide-react";

export default function PublicPage() {
  return (
    <div className="min-h-screen font-sans selection:bg-[#D9779B] selection:text-[#2A2522]">
      <Navbar />
      <Hero />
      <Mindset />
      <Services />
      <Pricing />
      <BeforeAfter />
      <BookingSection />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#FAF7F2] z-50 border-b retro-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="http://web2.itnahodinu.cz/uklid/logo.webp" alt="Dočista s Káčou Logo" className="h-12 w-auto object-contain" referrerPolicy="no-referrer" />
          <span className="font-serif text-2xl tracking-tight hidden sm:block font-bold">Dočista s Káčou</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-mono text-xs font-bold tracking-[0.15em] uppercase">
          <a href="#o-nas" className="hover:text-[#D9779B] transition-colors">O mně</a>
          <a href="#sluzby" className="hover:text-[#D9779B] transition-colors">Služby</a>
          <a href="#cenik" className="hover:text-[#D9779B] transition-colors">Ceník</a>
          <a href="#rezervace" className="bg-[#D9779B] text-[#2A2522] px-6 py-3 rounded-full retro-border retro-shadow-sm hover:bg-[#c9668a] transition-colors">
            Rezervovat
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 min-h-[90vh] flex items-center relative overflow-hidden border-b retro-border bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="max-w-2xl z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border retro-border mb-8 bg-[#D0F0F0] retro-shadow-sm">
            <Star className="w-3 h-3 text-[#2A2522]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A2522]">Prémiové úklidové služby</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] mb-8 text-[#2A2522] tracking-tight font-bold">
            Čistý domov,<br />
            <span className="italic text-[#D9779B]">klidná mysl.</span>
          </h1>
          <p className="text-lg font-sans text-gray-700 mb-10 leading-relaxed max-w-md font-medium">
            Dopřejte si luxus dokonale čistého domova. Profesionální úklidové služby s důrazem na detail a vaši spokojenost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#rezervace" className="inline-flex items-center justify-center gap-3 bg-[#D9779B] text-[#2A2522] px-8 py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold retro-border retro-shadow hover:bg-[#c9668a] transition-colors">
              Rezervovat úklid
              <ChevronRight className="w-4 h-4" />
            </a>
            <a href="#sluzby" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold border retro-border bg-[#D0F0F0] retro-shadow hover:bg-[#bde8e8] transition-colors text-[#2A2522]">
              Naše služby
            </a>
          </div>
        </div>
        <div className="relative hidden md:block z-10">
          <div className="aspect-[3/4] rounded-t-full overflow-hidden retro-border p-2 bg-[#D4B886] rotate-2 hover:rotate-0 transition-transform duration-500 retro-shadow">
            <img 
              src="https://picsum.photos/seed/luxuryliving/800/1000" 
              alt="Luxurious living room" 
              className="w-full h-full object-cover rounded-t-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute top-20 -right-10 w-32 h-32 bg-[#D0F0F0] rounded-full retro-border -z-10"></div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute -bottom-20 -left-20 w-[40rem] h-[40rem] border-4 border-[#D0F0F0] rounded-full -z-0 opacity-50"></div>
      <div className="absolute -bottom-10 -left-10 w-[30rem] h-[30rem] border-4 border-[#D9779B] rounded-full -z-0 opacity-20"></div>
    </section>
  );
}

function Mindset() {
  return (
    <section id="o-nas" className="py-24 px-6 bg-[#D0F0F0] border-b retro-border">
      <div className="max-w-5xl mx-auto text-center">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-6 block text-[#2A2522]">Můj mindset</span>
        <h2 className="text-3xl md:text-5xl font-serif leading-tight text-[#2A2522] max-w-4xl mx-auto italic font-bold">
          "Věřím, že prostředí, ve kterém žijeme, přímo ovlivňuje naši náladu a energii. 
          Čistý domov není jen o pořádku, je to o vytvoření prostoru, kde si vaše mysl může skutečně odpočinout."
        </h2>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-8 bg-white retro-border retro-shadow">
            <Shield className="w-8 h-8 text-[#D9779B] mb-6" />
            <h3 className="text-xl font-serif mb-3 font-bold">Spolehlivost</h3>
            <p className="text-[#2A2522] text-sm leading-relaxed font-medium">Diskrétnost a pečlivost jsou u mě na prvním místě. Ke každému domovu přistupuji s respektem.</p>
          </div>
          <div className="p-8 bg-white retro-border retro-shadow">
            <Star className="w-8 h-8 text-[#D4B886] mb-6" />
            <h3 className="text-xl font-serif mb-3 font-bold">Prémiová kvalita</h3>
            <p className="text-[#2A2522] text-sm leading-relaxed font-medium">Používám špičkové vybavení a profesionální čistící prostředky pro dokonalý výsledek.</p>
          </div>
          <div className="p-8 bg-white retro-border retro-shadow">
            <Clock className="w-8 h-8 text-[#9B72B0] mb-6" />
            <h3 className="text-xl font-serif mb-3 font-bold">Úspora času</h3>
            <p className="text-[#2A2522] text-sm leading-relaxed font-medium">Věnujte svůj čas rodině a koníčkům, starosti s úklidem nechte s klidným svědomím na mně.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      title: "Generální úklidy",
      desc: "Hloubkový úklid celého domova. Ideální na jaře, před svátky nebo po rekonstrukci. Zahrnuje mytí oken, čištění spár a kompletní dezinfekci.",
      image: "https://picsum.photos/seed/generalcleaning/600/800"
    },
    {
      title: "Pravidelné úklidy",
      desc: "Udržování perfektní čistoty na týdenní nebo dvoutýdenní bázi. Vysávání, vytírání, utírání prachu, úklid koupelny a kuchyně.",
      image: "https://picsum.photos/seed/regularcleaning/600/800"
    },
    {
      title: "Tepování",
      desc: "Hloubkové čištění sedacích souprav, koberců, matrací a čalouněných židlí profesionálním extraktorem. Odstraní skvrny a roztoče.",
      image: "https://picsum.photos/seed/upholstery/600/800"
    },
    {
      title: "Parní čistič",
      desc: "Ekologické a vysoce efektivní čištění horkou párou. Ideální na spáry, koupelny, kuchyně a dezinfekci bez použití chemie.",
      image: "https://picsum.photos/seed/steamclean/600/800"
    }
  ];

  return (
    <section id="sluzby" className="py-24 px-6 bg-[#FAF7F2] border-b retro-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-4 block text-[#D9779B]">Co nabízíme</span>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#2A2522]">Naše služby</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div key={i} className="group retro-border p-4 bg-white retro-shadow flex flex-col">
              <div className="aspect-[3/4] overflow-hidden retro-border mb-6 rounded-t-full bg-[#D0F0F0]">
                <img 
                  src={s.image} 
                  alt={s.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-2xl font-serif mb-3 font-bold text-[#2A2522]">{s.title}</h3>
              <p className="text-sm leading-relaxed flex-grow font-sans font-medium text-gray-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="cenik" className="py-24 px-6 bg-[#D9779B] border-b retro-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-4 block text-[#2A2522]">Transparentní ceny</span>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#2A2522]">Ceník služeb</h2>
        </div>
        
        <div className="bg-white retro-border p-8 md:p-16 retro-shadow">
          <div className="space-y-8">
            <div className="flex items-end">
              <div>
                <h4 className="text-2xl font-serif font-bold text-[#2A2522]">Pravidelný úklid</h4>
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">Cena za hodinu práce</p>
              </div>
              <div className="dotted-leader"></div>
              <div className="text-2xl font-serif whitespace-nowrap font-bold text-[#2A2522]">od 450 Kč</div>
            </div>
            
            <div className="flex items-end">
              <div>
                <h4 className="text-2xl font-serif font-bold text-[#2A2522]">Generální úklid</h4>
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">Cena za hodinu práce</p>
              </div>
              <div className="dotted-leader"></div>
              <div className="text-2xl font-serif whitespace-nowrap font-bold text-[#2A2522]">od 550 Kč</div>
            </div>
            
            <div className="flex items-end">
              <div>
                <h4 className="text-2xl font-serif font-bold text-[#2A2522]">Tepování sedací soupravy</h4>
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">Dle velikosti a znečištění</p>
              </div>
              <div className="dotted-leader"></div>
              <div className="text-2xl font-serif whitespace-nowrap font-bold text-[#2A2522]">od 800 Kč</div>
            </div>
            
            <div className="flex items-end">
              <div>
                <h4 className="text-2xl font-serif font-bold text-[#2A2522]">Čištění parním čističem</h4>
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">Koupelny, kuchyně, spáry</p>
              </div>
              <div className="dotted-leader"></div>
              <div className="text-2xl font-serif whitespace-nowrap font-bold text-[#2A2522]">od 600 Kč/h</div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t-3 border-[#2A2522]">
            <p className="font-mono text-xs text-[#2A2522] leading-relaxed text-center uppercase tracking-widest font-bold">
              Přesná cena se odvíjí od velikosti prostor a míry znečištění. Před každým úklidem vám ráda připravím individuální cenovou nabídku. Doprava po Praze 10 zdarma.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeforeAfter() {
  return (
    <section className="py-24 px-6 bg-[#D4B886] border-b retro-border overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-4 block text-[#2A2522]">Výsledky naší práce</span>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#2A2522]">Před a Po</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="polaroid rotate-[-3deg] z-10">
            <img src="https://picsum.photos/seed/dirtykitchen/800/800" alt="Před úklidem" className="w-full aspect-square object-cover retro-border" referrerPolicy="no-referrer" />
            <div className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-center font-bold text-[#2A2522]">Stav Před</div>
          </div>
          <div className="polaroid rotate-[3deg] mt-12 md:mt-0 z-20">
            <img src="https://picsum.photos/seed/cleankitchen/800/800" alt="Po úklidu" className="w-full aspect-square object-cover retro-border" referrerPolicy="no-referrer" />
            <div className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-center font-bold text-[#2A2522]">Stav Po</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", service_type: "Pravidelný úklid", date: "", time_slot: ""
  });
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (step === 2) {
      fetch("/api/availability")
        .then(res => res.json())
        .then(data => setAvailableSlots(data));
    }
  }, [step]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const slotsByDate = availableSlots.reduce((acc: any, slot: any) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const inputClasses = "w-full px-4 py-3 bg-[#FAF7F2] border retro-border rounded-none focus:outline-none focus:bg-[#D0F0F0] transition-colors font-sans font-bold text-[#2A2522]";
  const labelClasses = "block font-mono text-[10px] uppercase tracking-widest text-[#2A2522] font-bold mb-2";

  return (
    <section id="rezervace" className="py-24 px-6 bg-[#FAF7F2] border-b retro-border">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-4 block text-[#D9779B]">Online rezervace</span>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#2A2522]">Objednat úklid</h2>
        </div>

        {success ? (
          <div className="bg-white retro-border p-12 text-center retro-shadow">
            <div className="w-16 h-16 border retro-border bg-[#D0F0F0] rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-8 h-8 text-[#2A2522]" />
            </div>
            <h3 className="text-3xl font-serif mb-4 font-bold text-[#2A2522]">Děkujeme za rezervaci!</h3>
            <p className="text-[#2A2522] mb-10 font-sans font-medium">Vaše objednávka byla úspěšně přijata. Brzy se vám ozveme pro potvrzení detailů.</p>
            <button 
              onClick={() => { setSuccess(false); setStep(1); setFormData({name: "", email: "", phone: "", address: "", service_type: "Pravidelný úklid", date: "", time_slot: ""}); }}
              className="bg-[#D9779B] text-[#2A2522] px-8 py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold retro-border retro-shadow-sm hover:bg-[#c9668a] transition-colors"
            >
              Nová rezervace
            </button>
          </div>
        ) : (
          <div className="bg-white retro-border p-8 md:p-12 retro-shadow">
            {/* Progress */}
            <div className="flex items-center justify-center mb-12 font-mono text-sm font-bold">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border retro-border ${step >= 1 ? 'bg-[#D9779B] text-[#2A2522]' : 'bg-white text-gray-400'}`}>1</div>
              <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-[#2A2522]' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border retro-border ${step >= 2 ? 'bg-[#D9779B] text-[#2A2522]' : 'bg-white text-gray-400'}`}>2</div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Jméno a příjmení</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClasses} required />
                  </div>
                  <div>
                    <label className={labelClasses}>Telefon</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClasses} required />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>E-mail</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Adresa úklidu (Ulice, Město, PSČ)</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Typ služby</label>
                  <select value={formData.service_type} onChange={e => setFormData({...formData, service_type: e.target.value})} className={`${inputClasses} appearance-none`}>
                    <option value="Pravidelný úklid">Pravidelný úklid</option>
                    <option value="Generální úklid">Generální úklid</option>
                    <option value="Tepování">Tepování</option>
                    <option value="Parní čistič">Parní čistič</option>
                  </select>
                </div>
                <div className="pt-8">
                  <button type="submit" className="w-full bg-[#D9779B] text-[#2A2522] py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold retro-border retro-shadow-sm hover:bg-[#c9668a] transition-colors">
                    Pokračovat na výběr termínu
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h4 className="text-2xl font-serif mb-8 text-center font-bold text-[#2A2522]">Vyberte si volný termín</h4>
                  {Object.keys(slotsByDate).length === 0 ? (
                    <div className="text-center p-8 border retro-border bg-[#FAF7F2]">
                      <p className="font-sans text-[#2A2522] font-bold mb-4">Bohužel momentálně nejsou vypsány žádné volné termíny online.</p>
                      <p className="font-mono text-xs uppercase tracking-widest text-[#2A2522]">Prosím kontaktujte nás telefonicky.</p>
                    </div>
                  ) : (
                    <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                      {Object.keys(slotsByDate).sort().map(date => (
                        <div key={date}>
                          <h5 className="font-mono text-xs uppercase tracking-[0.15em] font-bold mb-4 pb-2 border-b retro-border sticky top-0 bg-white z-10 text-[#2A2522]">
                            {format(new Date(date), "EEEE, d. MMMM yyyy", { locale: cs })}
                          </h5>
                          <div className="grid grid-cols-2 gap-4">
                            {slotsByDate[date].map((slot: any) => (
                              <label key={slot.id} className={`
                                cursor-pointer border retro-border p-4 text-center transition-all font-mono text-sm font-bold
                                ${formData.date === slot.date && formData.time_slot === slot.time_slot 
                                  ? 'bg-[#D9779B] text-[#2A2522]' 
                                  : 'bg-[#FAF7F2] hover:bg-[#D0F0F0] text-[#2A2522]'}
                              `}>
                                <input 
                                  type="radio" 
                                  name="timeslot" 
                                  className="hidden"
                                  checked={formData.date === slot.date && formData.time_slot === slot.time_slot}
                                  onChange={() => setFormData({...formData, date: slot.date, time_slot: slot.time_slot})}
                                  required
                                />
                                <span>{slot.time_slot}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t retro-border">
                  <button type="button" onClick={() => setStep(1)} className="px-8 py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold border retro-border bg-white hover:bg-[#FAF7F2] transition-colors text-[#2A2522]">
                    Zpět
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading || !formData.date}
                    className="flex-1 bg-[#D9779B] text-[#2A2522] py-4 rounded-full font-mono text-xs uppercase tracking-[0.15em] font-bold retro-border retro-shadow-sm hover:bg-[#c9668a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Odesílám...' : 'Dokončit rezervaci'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#2A2522] pt-20 pb-10 px-6 text-[#FAF7F2]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <img src="http://web2.itnahodinu.cz/uklid/logo.webp" alt="Dočista s Káčou Logo" className="h-12 w-auto object-contain" referrerPolicy="no-referrer" />
            <span className="font-serif text-2xl tracking-tight font-bold">Dočista s Káčou</span>
          </div>
          <p className="text-[#FAF7F2]/80 leading-relaxed max-w-sm font-sans font-medium">
            Prémiové úklidové služby pro váš dokonalý domov. Spolehlivost, pečlivost a profesionální přístup.
          </p>
        </div>
        
        <div>
          <h4 className="font-mono text-xs uppercase tracking-[0.2em] mb-8 text-[#D4B886] font-bold">Kontakt</h4>
          <ul className="space-y-6 font-sans font-medium">
            <li className="flex items-start gap-4">
              <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-[#D9779B]" />
              <span>Kryšpínova 529/7<br />Praha 10, 109 00</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="w-5 h-5 shrink-0 text-[#D9779B]" />
              <a href="tel:+420607500413" className="hover:text-[#D9779B] transition-colors">607 500 413</a>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="w-5 h-5 shrink-0 text-[#D9779B]" />
              <a href="mailto:halakovk@seznam.cz" className="hover:text-[#D9779B] transition-colors">halakovk@seznam.cz</a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-mono text-xs uppercase tracking-[0.2em] mb-8 text-[#D4B886] font-bold">Sledujte nás</h4>
          <a 
            href="https://instagram.com/Docista_S_Kacou" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 text-[#FAF7F2] hover:text-[#D9779B] transition-colors group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-[#FAF7F2] bg-transparent flex items-center justify-center group-hover:bg-[#D9779B] group-hover:border-[#D9779B] group-hover:text-[#2A2522] transition-colors">
              <Instagram className="w-5 h-5" />
            </div>
            <span className="font-mono text-sm uppercase tracking-widest font-bold">@Docista_S_Kacou</span>
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-[#FAF7F2]/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono uppercase tracking-widest text-[#FAF7F2]/60 font-bold">
        <p>&copy; {new Date().getFullYear()} Dočista s Káčou.</p>
        <div className="flex gap-6">
          <a href="/login" className="hover:text-[#D9779B] transition-colors">Přihlášení pro zaměstnance</a>
        </div>
      </div>
    </footer>
  );
}
