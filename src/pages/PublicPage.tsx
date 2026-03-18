import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Check, ChevronRight, MapPin, Phone, Mail, Instagram, Star, Shield, Clock } from "lucide-react";

export default function PublicPage() {
  return (
    <div className="min-h-screen font-sans selection:bg-[#E588A5] selection:text-white">
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
    <nav className="fixed top-0 left-0 right-0 bg-[#FCF9F6]/90 backdrop-blur-md z-50 border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="http://web2.itnahodinu.cz/uklid/logo.webp" alt="Dočista s Káčou Logo" className="h-12 w-auto object-contain" referrerPolicy="no-referrer" />
          <span className="font-script text-3xl text-[#E588A5] hidden sm:block">Dočista s Káčou</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-sans text-xs font-semibold tracking-widest uppercase text-[#2D2825]">
          <a href="#o-nas" className="hover:text-[#E588A5] transition-colors">O mně</a>
          <a href="#sluzby" className="hover:text-[#E588A5] transition-colors">Služby</a>
          <a href="#cenik" className="hover:text-[#E588A5] transition-colors">Ceník</a>
          <a href="#rezervace" className="btn-gold-wrapper" style={{ maxWidth: '160px' }}>
            <span className="btn-pink-inner" style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem' }}>Rezervovat</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden text-center">
      <div className="max-w-3xl mx-auto z-10 flex flex-col items-center">
        
        <div className="mb-8">
          <img src="http://web2.itnahodinu.cz/uklid/logo.webp" alt="Dočista s Káčou" className="h-48 md:h-64 w-auto object-contain mx-auto" referrerPolicy="no-referrer" />
        </div>

        <div className="badge-gold mb-10">
          <Star className="w-3 h-3 text-[#D4AF37]" />
          <span>Prémiové úklidové služby</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] mb-8 text-[#2D2825] tracking-tight">
          Čistý domov,<br />
          <span className="font-script text-[#E588A5] text-6xl md:text-8xl font-normal tracking-normal">klidná mysl.</span>
        </h1>
        
        <p className="text-lg md:text-xl font-sans text-[#2D2825]/80 mb-12 leading-relaxed max-w-2xl font-medium">
          Dopřejte si luxus dokonale čistého domova.<br className="hidden md:block" />
          Profesionální úklidové služby s důrazem na detail a vaši spokojenost.
        </p>
        
        <div className="flex flex-col items-center gap-4 w-full">
          <a href="#rezervace" className="btn-gold-wrapper">
            <span className="btn-pink-inner">
              Rezervovat úklid
              <ChevronRight className="w-4 h-4" />
            </span>
          </a>
          <a href="#sluzby" className="btn-gold-wrapper">
            <span className="btn-blue-inner">
              Naše služby
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Mindset() {
  return (
    <section id="o-nas" className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto text-center">
        <span className="font-sans text-xs font-semibold uppercase tracking-widest mb-6 block text-[#E588A5]">Můj mindset</span>
        <h2 className="text-3xl md:text-5xl font-serif leading-tight text-[#2D2825] max-w-4xl mx-auto italic">
          "Věřím, že prostředí, ve kterém žijeme, přímo ovlivňuje naši náladu a energii. 
          Čistý domov není jen o pořádku, je to o vytvoření prostoru, kde si vaše mysl může skutečně odpočinout."
        </h2>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-8 glass-card">
            <Shield className="w-8 h-8 text-[#E588A5] mb-6" />
            <h3 className="text-xl font-serif mb-3 font-semibold text-[#2D2825]">Spolehlivost</h3>
            <p className="text-[#2D2825]/80 text-sm leading-relaxed font-medium">Diskrétnost a pečlivost jsou u mě na prvním místě. Ke každému domovu přistupuji s respektem.</p>
          </div>
          <div className="p-8 glass-card">
            <Star className="w-8 h-8 text-[#D4AF37] mb-6" />
            <h3 className="text-xl font-serif mb-3 font-semibold text-[#2D2825]">Prémiová kvalita</h3>
            <p className="text-[#2D2825]/80 text-sm leading-relaxed font-medium">Používám špičkové vybavení a profesionální čistící prostředky pro dokonalý výsledek.</p>
          </div>
          <div className="p-8 glass-card">
            <Clock className="w-8 h-8 text-[#354060] mb-6" />
            <h3 className="text-xl font-serif mb-3 font-semibold text-[#2D2825]">Úspora času</h3>
            <p className="text-[#2D2825]/80 text-sm leading-relaxed font-medium">Věnujte svůj čas rodině a koníčkům, starosti s úklidem nechte s klidným svědomím na mně.</p>
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
    <section id="sluzby" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-xs font-semibold uppercase tracking-widest mb-4 block text-[#E588A5]">Co nabízíme</span>
          <h2 className="text-5xl md:text-6xl font-serif text-[#2D2825]">Naše služby</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div key={i} className="group glass-card p-4 flex flex-col">
              <div className="aspect-[3/4] overflow-hidden mb-6 rounded-2xl bg-[#F2E3C6]/30">
                <img 
                  src={s.image} 
                  alt={s.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-2xl font-serif mb-3 font-semibold text-[#2D2825]">{s.title}</h3>
              <p className="text-sm leading-relaxed flex-grow font-sans font-medium text-[#2D2825]/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="cenik" className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-xs font-semibold uppercase tracking-widest mb-4 block text-[#E588A5]">Transparentní ceny</span>
          <h2 className="text-5xl md:text-6xl font-serif text-[#2D2825]">Ceník služeb</h2>
        </div>
        
        <div className="glass-card p-8 md:p-16">
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h4 className="text-2xl font-serif font-semibold text-[#2D2825]">Pravidelný úklid</h4>
                <p className="font-sans text-[10px] text-[#2D2825]/60 uppercase tracking-widest mt-2 font-semibold">Cena za hodinu práce</p>
              </div>
              <div className="text-2xl font-serif whitespace-nowrap text-[#E588A5]">od 450 Kč</div>
            </div>
            
            <div className="flex items-end justify-between border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h4 className="text-2xl font-serif font-semibold text-[#2D2825]">Generální úklid</h4>
                <p className="font-sans text-[10px] text-[#2D2825]/60 uppercase tracking-widest mt-2 font-semibold">Cena za hodinu práce</p>
              </div>
              <div className="text-2xl font-serif whitespace-nowrap text-[#E588A5]">od 550 Kč</div>
            </div>
            
            <div className="flex items-end justify-between border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h4 className="text-2xl font-serif font-semibold text-[#2D2825]">Tepování sedací soupravy</h4>
                <p className="font-sans text-[10px] text-[#2D2825]/60 uppercase tracking-widest mt-2 font-semibold">Dle velikosti a znečištění</p>
              </div>
              <div className="text-2xl font-serif whitespace-nowrap text-[#E588A5]">od 800 Kč</div>
            </div>
            
            <div className="flex items-end justify-between border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h4 className="text-2xl font-serif font-semibold text-[#2D2825]">Čištění parním čističem</h4>
                <p className="font-sans text-[10px] text-[#2D2825]/60 uppercase tracking-widest mt-2 font-semibold">Koupelny, kuchyně, spáry</p>
              </div>
              <div className="text-2xl font-serif whitespace-nowrap text-[#E588A5]">od 600 Kč/h</div>
            </div>
          </div>
          
          <div className="mt-12 pt-8">
            <p className="font-sans text-xs text-[#2D2825]/70 leading-relaxed text-center uppercase tracking-widest font-semibold">
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
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-sans text-xs font-semibold uppercase tracking-widest mb-4 block text-[#E588A5]">Výsledky naší práce</span>
          <h2 className="text-5xl md:text-6xl font-serif text-[#2D2825]">Před a Po</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="glass-card p-4 rotate-[-2deg] z-10 transition-transform hover:rotate-0 hover:z-30">
            <img src="https://picsum.photos/seed/dirtykitchen/800/800" alt="Před úklidem" className="w-full aspect-square object-cover rounded-xl" referrerPolicy="no-referrer" />
            <div className="mt-6 font-sans text-sm uppercase tracking-widest text-center font-semibold text-[#2D2825]">Stav Před</div>
          </div>
          <div className="glass-card p-4 rotate-[2deg] mt-12 md:mt-0 z-20 transition-transform hover:rotate-0 hover:z-30">
            <img src="https://picsum.photos/seed/cleankitchen/800/800" alt="Po úklidu" className="w-full aspect-square object-cover rounded-xl" referrerPolicy="no-referrer" />
            <div className="mt-6 font-sans text-sm uppercase tracking-widest text-center font-semibold text-[#2D2825]">Stav Po</div>
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
      fetch(`/api/availability?address=${encodeURIComponent(formData.address)}`)
        .then(res => res.json())
        .then(data => setAvailableSlots(data));
    }
  }, [step, formData.address]);

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

  const labelClasses = "block font-sans text-[10px] uppercase tracking-widest text-[#2D2825] font-semibold mb-2";

  return (
    <section id="rezervace" className="py-24 px-6 relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-xs font-semibold uppercase tracking-widest mb-4 block text-[#E588A5]">Online rezervace</span>
          <h2 className="text-5xl md:text-6xl font-serif text-[#2D2825]">Objednat úklid</h2>
        </div>

        {success ? (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 bg-[#F9F0F3] rounded-full flex items-center justify-center mx-auto mb-8 text-[#E588A5]">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-serif mb-4 text-[#2D2825]">Děkujeme za rezervaci!</h3>
            <p className="text-[#2D2825]/80 mb-10 font-sans font-medium">Vaše objednávka byla úspěšně přijata. Brzy se vám ozveme pro potvrzení detailů.</p>
            <button 
              onClick={() => { setSuccess(false); setStep(1); setFormData({name: "", email: "", phone: "", address: "", service_type: "Pravidelný úklid", date: "", time_slot: ""}); }}
              className="btn-gold-wrapper"
            >
              <span className="btn-pink-inner">Nová rezervace</span>
            </button>
          </div>
        ) : (
          <div className="glass-card p-8 md:p-12">
            {/* Progress */}
            <div className="flex items-center justify-center mb-12 font-sans text-sm font-semibold">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-[#E588A5] text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>1</div>
              <div className={`w-16 h-px mx-4 ${step >= 2 ? 'bg-[#E588A5]' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-[#E588A5] text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>2</div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Jméno a příjmení</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-elegant" required />
                  </div>
                  <div>
                    <label className={labelClasses}>Telefon</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-elegant" required />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>E-mail</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-elegant" required />
                </div>
                <div>
                  <label className={labelClasses}>Adresa úklidu (Ulice, Město, PSČ)</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="input-elegant" required />
                </div>
                <div>
                  <label className={labelClasses}>Typ služby</label>
                  <select value={formData.service_type} onChange={e => setFormData({...formData, service_type: e.target.value})} className="input-elegant appearance-none">
                    <option value="Pravidelný úklid">Pravidelný úklid</option>
                    <option value="Generální úklid">Generální úklid</option>
                    <option value="Tepování">Tepování</option>
                    <option value="Parní čistič">Parní čistič</option>
                  </select>
                </div>
                <div className="pt-8 flex justify-center">
                  <button type="submit" className="btn-gold-wrapper">
                    <span className="btn-pink-inner">Pokračovat</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h4 className="text-2xl font-serif mb-8 text-center text-[#2D2825]">Vyberte si volný termín</h4>
                  {Object.keys(slotsByDate).length === 0 ? (
                    <div className="text-center p-8 bg-white/50 rounded-2xl border border-[#D4AF37]/20">
                      <p className="font-sans text-[#2D2825] font-semibold mb-4">Bohužel momentálně nejsou vypsány žádné volné termíny online.</p>
                      <p className="font-sans text-xs uppercase tracking-widest text-[#2D2825]/70">Prosím kontaktujte nás telefonicky.</p>
                    </div>
                  ) : (
                    <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                      {Object.keys(slotsByDate).sort().map(date => (
                        <div key={date}>
                          <h5 className="font-sans text-xs uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-[#D4AF37]/20 sticky top-0 bg-[#FCF9F6] z-10 text-[#E588A5]">
                            {format(new Date(date), "EEEE, d. MMMM yyyy", { locale: cs })}
                          </h5>
                          <div className="grid grid-cols-2 gap-4">
                            {slotsByDate[date].map((slot: any) => (
                              <label key={slot.id} className={`
                                cursor-pointer p-4 text-center transition-all font-sans text-sm font-semibold rounded-xl border
                                ${formData.date === slot.date && formData.time_slot === slot.time_slot 
                                  ? 'bg-[#E588A5] text-white border-[#E588A5]' 
                                  : 'bg-white border-[#D4AF37]/20 hover:border-[#E588A5] text-[#2D2825]'}
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
                
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#D4AF37]/20 justify-center">
                  <button type="button" onClick={() => setStep(1)} className="px-8 py-4 rounded-full font-sans text-xs uppercase tracking-widest font-semibold border border-[#D4AF37]/30 bg-white hover:bg-[#FCF9F6] transition-colors text-[#2D2825]">
                    Zpět
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading || !formData.date}
                    className="btn-gold-wrapper disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="btn-pink-inner">{loading ? 'Odesílám...' : 'Dokončit rezervaci'}</span>
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
    <footer className="bg-[#2D2825] pt-20 pb-10 px-6 text-[#FCF9F6]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-script text-4xl text-[#E588A5]">Dočista s Káčou</span>
          </div>
          <p className="text-[#FCF9F6]/70 leading-relaxed max-w-sm font-sans font-medium">
            Prémiové úklidové služby pro váš dokonalý domov. Spolehlivost, pečlivost a profesionální přístup.
          </p>
        </div>
        
        <div>
          <h4 className="font-sans text-xs uppercase tracking-widest mb-8 text-[#D4AF37] font-semibold">Kontakt</h4>
          <ul className="space-y-6 font-sans font-medium text-[#FCF9F6]/90">
            <li className="flex items-start gap-4">
              <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-[#E588A5]" />
              <span>Kryšpínova 529/7<br />Praha 10, 109 00</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="w-5 h-5 shrink-0 text-[#E588A5]" />
              <a href="tel:+420607500413" className="hover:text-[#E588A5] transition-colors">607 500 413</a>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="w-5 h-5 shrink-0 text-[#E588A5]" />
              <a href="mailto:halakovk@seznam.cz" className="hover:text-[#E588A5] transition-colors">halakovk@seznam.cz</a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-sans text-xs uppercase tracking-widest mb-8 text-[#D4AF37] font-semibold">Sledujte nás</h4>
          <a 
            href="https://instagram.com/Docista_S_Kacou" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 text-[#FCF9F6] hover:text-[#E588A5] transition-colors group"
          >
            <div className="w-12 h-12 rounded-full border border-[#FCF9F6]/30 bg-transparent flex items-center justify-center group-hover:border-[#E588A5] transition-colors">
              <Instagram className="w-5 h-5" />
            </div>
            <span className="font-sans text-sm uppercase tracking-widest font-semibold">@Docista_S_Kacou</span>
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-[#FCF9F6]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans uppercase tracking-widest text-[#FCF9F6]/50 font-semibold">
        <p>&copy; {new Date().getFullYear()} Dočista s Káčou.</p>
        <div className="flex gap-6">
          <a href="/login" className="hover:text-[#E588A5] transition-colors">Přihlášení pro zaměstnance</a>
        </div>
      </div>
    </footer>
  );
}
