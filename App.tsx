
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './components/Button';
import { ComparisonSlider } from './components/ComparisonSlider';
import { LoadingScreen } from './components/LoadingScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { ROOM_OPTIONS } from './constants';
import { generateRoomRedesign } from './services/geminiService';
import { authService } from './services/authService';
import { imageDb } from './services/imageDb';
import { AppState, DesignStyle, User } from './types';
import { 
  Upload, Sparkles, Download, RefreshCw, Image as ImageIcon, 
  Check, ArrowRight, Zap, ChevronDown, Star, Wallet, CreditCard, LogOut, ShieldCheck, Infinity, X, Tag, Settings
} from 'lucide-react';

// --- Auth Page Component ---
const AuthPage = ({ 
    initialView, 
    onLogin, 
    onSwitch,
    demos
}: { 
    initialView: 'login' | 'signup', 
    onLogin: (user: User) => void,
    onSwitch: (view: 'login' | 'signup') => void,
    demos: any[]
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    
    const [activeDemo, setActiveDemo] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            let user: User;
            if (initialView === 'signup') {
                user = await authService.signup(formData.firstName, formData.lastName, formData.email, formData.password);
            } else {
                user = await authService.login(formData.email, formData.password);
            }
            onLogin(user);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const user = await authService.loginWithGoogle();
            onLogin(user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const currentDemo = demos[activeDemo] || demos[0];

    return (
        <div className="flex min-h-screen bg-[#F9F8F6] font-sans">
            <div className="hidden lg:block w-1/2 relative overflow-hidden bg-[#154845]">
                <div className="absolute inset-0 z-0">
                    <ComparisonSlider 
                        variant="hero"
                        beforeImage={currentDemo.before}
                        afterImage={currentDemo.after}
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-12 pt-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                    <div className="pointer-events-auto flex gap-3 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        {demos.map((demo: any) => (
                            <button 
                                key={demo.id}
                                onClick={() => setActiveDemo(demo.id)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                    activeDemo === demo.id 
                                        ? 'bg-[#154845] text-white shadow-lg scale-105' 
                                        : 'text-white hover:bg-white/20'
                                }`}
                            >
                                {demo.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="absolute top-12 left-12 z-10">
                    <div className="flex items-center gap-2 mb-6 text-white drop-shadow-lg">
                         <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                            <Sparkles size={28} fill="currentColor" className="text-white"/>
                         </div>
                         <span className="font-extrabold text-3xl tracking-tight">DreamDesign</span>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F9F8F6]">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(21,72,69,0.05)] border border-[#E2E8F0]">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-[#154845]">
                            {initialView === 'login' ? 'Welcome back' : 'Create account'}
                        </h2>
                        <p className="text-[#64748B] mt-2 font-medium">
                            {initialView === 'login' ? 'Log in to access your saved designs.' : 'Sign up to get 1 free credit.'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button onClick={handleGoogleLogin} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#334155] font-bold py-3.5 rounded-xl transition-colors">
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                            Continue with Google
                        </button>
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E2E8F0]"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-[#94A3B8] font-bold">OR</span></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {initialView === 'signup' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="First name" required className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E2E8F0] focus:border-[#C26D53] focus:ring-0 outline-none font-medium text-[#154845] bg-[#F8FAFC]" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                                    <input type="text" placeholder="Last name" required className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E2E8F0] focus:border-[#C26D53] focus:ring-0 outline-none font-medium text-[#154845] bg-[#F8FAFC]" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                                </div>
                            )}
                            <input type="email" placeholder="Email address" required className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E2E8F0] focus:border-[#C26D53] focus:ring-0 outline-none font-medium text-[#154845] bg-[#F8FAFC]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            <input type="password" placeholder="Password" required minLength={6} className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E2E8F0] focus:border-[#C26D53] focus:ring-0 outline-none font-medium text-[#154845] bg-[#F8FAFC]" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />

                            {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

                            <Button type="submit" className="w-full py-4 text-lg shadow-lg hover:shadow-xl" isLoading={isLoading}>
                                {initialView === 'login' ? 'Log In' : 'Create Account'}
                            </Button>
                        </form>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-[#64748B] font-medium">
                            {initialView === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button onClick={() => onSwitch(initialView === 'login' ? 'signup' : 'login')} className="text-[#C26D53] font-bold hover:underline">
                                {initialView === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main App Component ---
export default function App() {
  const [state, setState] = useState<AppState>({
    view: 'landing',
    user: null,
    authView: 'signup',
    originalImage: null,
    selectedRoomType: null,
    selectedStyles: [],
    generatedImages: [],
    isGenerating: false,
    activeResultIndex: 0
  });

  const [showAllStyles, setShowAllStyles] = useState(false);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeHeroDemo, setActiveHeroDemo] = useState(0);

  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  
  // Admin & Dynamic Data State
  const [showAdmin, setShowAdmin] = useState(false);
  const [heroDemos, setHeroDemos] = useState<any[]>(imageDb.getHeroDemos());
  const [authDemos, setAuthDemos] = useState<any[]>(imageDb.getAuthDemos());
  const [galleryItems, setGalleryItems] = useState<any[]>(imageDb.getGalleryItems());
  const [dynamicStyles, setDynamicStyles] = useState(imageDb.getStyles());
  const [featureImages, setFeatureImages] = useState<any[]>(imageDb.getFeatureImages());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) setState(prev => ({ ...prev, user }));
  }, []);

  const refreshImages = () => {
      setHeroDemos(imageDb.getHeroDemos());
      setAuthDemos(imageDb.getAuthDemos());
      setGalleryItems(imageDb.getGalleryItems());
      setDynamicStyles(imageDb.getStyles());
      setFeatureImages(imageDb.getFeatureImages());
  };

  // Re-fetch images if Admin closes (user might have saved changes)
  useEffect(() => {
      if (!showAdmin) refreshImages();
  }, [showAdmin]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoomDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({
          ...prev,
          originalImage: reader.result as string,
          generatedImages: [],
          activeResultIndex: 0,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleStyle = (styleId: DesignStyle) => {
    setState(prev => {
        const isSelected = prev.selectedStyles.includes(styleId);
        let newStyles;
        if (isSelected) {
            newStyles = prev.selectedStyles.filter(id => id !== styleId);
        } else {
            if (prev.selectedStyles.length >= 4) return prev;
            newStyles = [...prev.selectedStyles, styleId];
        }
        return { ...prev, selectedStyles: newStyles };
    });
  };

  const openAuth = (view: 'login' | 'signup' = 'login') => {
      setState(prev => ({ ...prev, view: 'auth', authView: view }));
  };

  const logout = () => {
      authService.logout();
      setState(prev => ({ ...prev, user: null, view: 'landing', isProfileDropdownOpen: false }));
  };

  const handleGenerate = async () => {
    if (!state.user) {
        openAuth('signup');
        return;
    }
    const cost = state.selectedStyles.length;
    if (state.user.credits < cost) {
        setIsCreditModalOpen(true);
        return;
    }

    // Always check for API key
    if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) await window.aistudio.openSelectKey();
    }

    if (!state.originalImage || !state.selectedRoomType || state.selectedStyles.length === 0) return;

    try {
        const updatedUser = authService.deductCredits(state.user.id, cost);
        setState(prev => ({ ...prev, user: updatedUser, isGenerating: true, generatedImages: [], activeResultIndex: 0 }));

        const promises = state.selectedStyles.map(styleId => {
            const styleObj = dynamicStyles.find(s => s.id === styleId);
            return generateRoomRedesign(
                state.originalImage!,
                state.selectedRoomType!,
                styleId,
                styleObj?.description || ''
            ).then(res => ({ style: styleId, ...res }));
        });

        const generatedResults = await Promise.all(promises);
        setState(prev => ({
            ...prev,
            generatedImages: generatedResults,
            isGenerating: false,
            activeResultIndex: 0
        }));

    } catch (error: any) {
        console.error("Failed to generate", error);
        
        alert("Something went wrong with the generation. Please try again.");
        
        // Refund credits on failure
        if (state.user) {
             const refundedUser = authService.addCredits(state.user.id, cost);
             setState(prev => ({ ...prev, user: refundedUser, isGenerating: false }));
        } else {
             setState(prev => ({ ...prev, isGenerating: false }));
        }
    }
  };

  const buyCredits = (amount: number) => {
      if (!state.user) {
          openAuth('signup');
          return;
      }
      const updatedUser = authService.addCredits(state.user.id, amount);
      setState(prev => ({ ...prev, user: updatedUser }));
      setIsCreditModalOpen(false);
      alert(`Success! Added ${amount} credits to your account.`);
  };

  const resetProject = () => {
      setState(prev => ({
          ...prev,
          view: 'studio',
          originalImage: null,
          selectedRoomType: null,
          selectedStyles: [],
          generatedImages: [],
          isGenerating: false,
          activeResultIndex: 0
      }));
      if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // --- Modals ---
  const CreditTopUpModal = () => {
      if (!isCreditModalOpen) return null;
      const tiers = [
        { credits: 5, price: '$9', label: "Starter" },
        { credits: 15, price: '$19', label: "Popular", popular: true },
        { credits: 40, price: '$29', label: "Best Value" }
      ];
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#154845]/70 backdrop-blur-sm" onClick={() => setIsCreditModalOpen(false)} />
            <div className="relative w-full max-w-2xl bg-[#F9F8F6] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
                <button onClick={() => setIsCreditModalOpen(false)} className="absolute top-4 right-4 p-2 bg-white rounded-full text-[#94A3B8] hover:text-[#154845] z-10"><X size={20} /></button>
                <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FDF2F0] text-[#C26D53] mb-4"><Zap size={28} fill="currentColor" /></div>
                    <h2 className="text-3xl font-extrabold text-[#154845] mb-2">Need more credits?</h2>
                    <p className="text-[#64748B] font-medium mb-8">You need more credits to generate this design. Choose a pack to continue instantly.</p>
                    <div className="grid md:grid-cols-3 gap-4">
                        {tiers.map((tier, i) => (
                            <div key={i} className={`relative flex flex-col p-6 rounded-2xl border-2 transition-transform hover:-translate-y-1 cursor-pointer ${tier.popular ? 'bg-white border-[#C26D53] shadow-xl' : 'bg-white border-[#E2E8F0] hover:border-[#154845]'}`}>
                                {tier.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C26D53] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</div>}
                                <div className="text-[#64748B] font-bold text-sm mb-1">{tier.label}</div>
                                <div className="text-[#154845] font-extrabold text-3xl mb-1">{tier.price}</div>
                                <div className="text-[#C26D53] font-bold text-sm mb-4">{tier.credits} Credits</div>
                                <Button size="sm" onClick={() => buyCredits(tier.credits)} className={`w-full ${tier.popular ? 'bg-[#C26D53] hover:bg-[#A5563D]' : 'bg-[#154845]'}`}>Buy</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      );
  };

  const StyleSuggestionModal = () => {
      if (!isStyleModalOpen) return null;
      const suggestions = dynamicStyles.filter(s => !state.selectedStyles.includes(s.id)).slice(0, 6);
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#154845]/70 backdrop-blur-sm" onClick={() => setIsStyleModalOpen(false)} />
            <div className="relative w-full max-w-4xl bg-[#F9F8F6] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white max-h-[90vh] flex flex-col">
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div><h2 className="text-3xl font-extrabold text-[#154845]">Explore new styles</h2><p className="text-[#64748B] font-medium">Select a style below to apply it to your project.</p></div>
                    <button onClick={() => setIsStyleModalOpen(false)} className="p-2 bg-white rounded-full text-[#94A3B8] hover:text-[#154845]"><X size={24} /></button>
                </div>
                <div className="overflow-y-auto p-8 pt-2 custom-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {suggestions.map((style) => (
                            <div key={style.id} onClick={() => { toggleStyle(style.id); setIsStyleModalOpen(false); }} className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                                <img src={style.image} alt={style.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white"><div className="font-bold text-lg">{style.name}</div><div className="text-xs text-white/80 line-clamp-1">{style.description}</div></div>
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Sparkles size={16} className="text-white" /></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      );
  };

  // --- Views ---
  const renderNavbar = () => (
    <nav className="fixed top-0 z-50 bg-[#F9F8F6]/80 backdrop-blur-xl w-full border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-20 transition-all duration-300">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setState(prev => ({ ...prev, view: 'landing' }))}>
            <div className="bg-[#154845] text-white p-1.5 rounded-lg"><Sparkles size={20} fill="currentColor" /></div>
            <span className="font-extrabold text-2xl text-[#154845] tracking-tight group-hover:text-[#C26D53] transition-colors">DreamDesign</span>
        </div>
        <div className="flex gap-4 md:gap-8 items-center">
            <Button size="md" variant="outline" onClick={() => setState(prev => ({ ...prev, view: 'studio' }))} className="border-2 font-bold hover:bg-[#154845] hover:text-white hover:border-[#154845]">Redesign</Button>
            <button onClick={() => setState(prev => ({ ...prev, view: 'pricing' }))} className={`text-lg font-bold transition-colors ${state.view === 'pricing' ? 'text-[#C26D53]' : 'text-[#154845] hover:text-[#C26D53]'}`}>Pricing</button>
            {state.user ? (
                <div className="relative ml-2" ref={profileDropdownRef}>
                    <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="hidden md:flex items-center gap-2 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full shadow-sm">
                            <Zap size={16} className="text-[#C26D53]" fill="currentColor"/><span className="font-bold text-[#154845]">{state.user.credits}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-[#C26D53] overflow-hidden"><img src={state.user.avatar} alt="Profile" className="w-full h-full object-cover" /></div>
                    </button>
                    {isProfileDropdownOpen && (
                        <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-[#F1F5F9] bg-[#F9F8F6]"><p className="font-bold text-[#154845] text-lg">{state.user.firstName} {state.user.lastName}</p><p className="text-sm text-[#64748B] font-medium truncate">{state.user.email}</p></div>
                            <div className="p-2 space-y-1">
                                <div className="px-3 py-2 flex items-center justify-between text-[#154845] font-bold"><span className="flex items-center gap-2"><Wallet size={18}/> Credits</span><span className="bg-[#FDF2F0] text-[#C26D53] px-2 py-0.5 rounded-md">{state.user.credits}</span></div>
                                <button onClick={() => {setIsCreditModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F1F5F9] text-[#154845] font-medium flex items-center gap-2"><CreditCard size={18}/> Buy Credits</button>
                                <button onClick={() => {setState(prev => ({...prev, view: 'studio'})); setIsProfileDropdownOpen(false)}} className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F1F5F9] text-[#154845] font-medium flex items-center gap-2"><Sparkles size={18}/> New Redesign</button>
                                <button onClick={() => { setShowAdmin(true); setIsProfileDropdownOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F1F5F9] text-[#154845] font-medium flex items-center gap-2"><Settings size={18}/> Admin</button>
                                <div className="border-t border-[#F1F5F9] my-1"></div>
                                <button onClick={logout} className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-medium flex items-center gap-2"><LogOut size={18}/> Log out</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex gap-4 ml-4"><button onClick={() => openAuth('login')} className="font-bold text-[#154845] hover:text-[#C26D53]">Log in</button><Button onClick={() => openAuth('signup')} className="hidden md:flex shadow-none bg-[#154845] text-white">Sign up</Button></div>
            )}
        </div>
      </div>
    </nav>
  );

  const renderLanding = () => {
    const currentHero = heroDemos[activeHeroDemo] || heroDemos[0];
    const featureBefore = featureImages.find(img => img.type === 'before') || { src: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=600' };
    const featureAfter = featureImages.find(img => img.type === 'after') || { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600' };

    return (
      <div className="flex flex-col items-center min-h-screen font-sans overflow-x-hidden bg-gradient-to-br from-[#F9F8F6] via-[#F9F8F6] to-[#EFEBE0]">
        {renderNavbar()}

        <section className="w-full px-6 pt-28 lg:pt-36 pb-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 xl:gap-20 items-center">
            <div className="flex flex-col items-start text-left relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#E6E2DE] text-[#154845] px-6 py-3 rounded-full text-xl font-bold tracking-wide border border-[#D1D5DB] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
                <Star size={24} fill="currentColor" /><span>#1 Virtual Room Designer</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-[#154845] leading-[1.1] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">Dream homes, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C26D53] to-[#B45309]">made instantly.</span></h1>
              <p className="text-xl text-[#475569] max-w-xl leading-relaxed mb-10 font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">Upload a photo and instantly explore beautiful redesign ideas tailored to your space. No more guessing what will look good—just clear, stunning visuals in seconds.</p>
              <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                <Button size="lg" onClick={() => setState(prev => ({ ...prev, view: 'studio' }))} className="shadow-xl shadow-[#154845]/20 px-10 py-5 text-lg">Redesign Your Room<ArrowRight size={20} className="ml-2" /></Button>
                <div className="flex items-center gap-3"><div className="flex -space-x-3">{[10, 11, 12].map(i => (<img key={i} src={`https://randomuser.me/api/portraits/women/${i + 40}.jpg`} className="w-11 h-11 rounded-full border-4 border-[#F9F8F6]" alt="user"/>))}</div><p className="text-sm font-bold text-[#64748B]">Loved by 10k+ homeowners</p></div>
              </div>
            </div>
            <div className="flex flex-col gap-6 animate-in zoom-in-95 duration-1000 delay-500">
                <div className="relative w-full aspect-[4/5] rounded-[2.5rem] shadow-[0_40px_80px_rgba(21,72,69,0.15)] bg-white overflow-hidden border-4 border-white">
                    <ComparisonSlider variant="hero" beforeImage={currentHero.before} afterImage={currentHero.after} />
                </div>
                <div className="flex justify-center gap-3">{heroDemos.map((demo) => (<button key={demo.id} onClick={() => setActiveHeroDemo(demo.id)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all border-2 ${activeHeroDemo === demo.id ? 'bg-[#154845] text-white border-[#154845] shadow-lg scale-105' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#C26D53] hover:text-[#C26D53]'}`}>{demo.label}</button>))}</div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 bg-white overflow-hidden border-y border-[#F1F5F9]">
          <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col items-center text-center gap-4">
             <h2 className="text-4xl font-extrabold text-[#154845]">Endless Inspiration</h2>
             <p className="text-[#64748B] font-medium text-lg">Real designs created by DreamDesign.</p>
          </div>
          <div className="relative w-full space-y-8">
              <div className="flex gap-6 w-max animate-scroll hover:pause px-6">
                 {galleryItems.map((item, i) => (
                   <div key={i} className="relative w-64 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shrink-0 group shadow-lg bg-[#E2E8F0]">
                      <img src={item.src} alt="Inspiration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"/>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                         <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 max-w-full">
                            <Tag size={14} className="text-[#C26D53] shrink-0" fill="currentColor"/>
                            <span className="truncate">{item.label}</span>
                        </div>
                      </div>
                   </div>
                 ))}
                 {/* Duplicate for infinite scroll */}
                 {galleryItems.map((item, i) => (
                   <div key={`dup-${i}`} className="relative w-64 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shrink-0 group shadow-lg bg-[#E2E8F0]">
                      <img src={item.src} alt="Inspiration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"/>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                         <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 max-w-full">
                            <Tag size={14} className="text-[#C26D53] shrink-0" fill="currentColor"/>
                            <span className="truncate">{item.label}</span>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
          </div>
        </section>

        <section className="w-full py-28 bg-[#F3F4F6] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#154845]/10 rounded-full blur-3xl"></div>
                <div className="absolute top-40 -left-20 w-72 h-72 bg-[#C26D53]/10 rounded-full blur-3xl"></div>
            </div>
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 md:gap-24 relative z-10">
                <div className="flex-1 text-left order-2 md:order-1">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#154845] mb-6 leading-tight">Transform any room <br/><span className="text-[#C26D53]">in one click.</span></h2>
                    <p className="text-[#475569] mb-10 text-lg font-medium leading-relaxed">Design with absolute confidence. Visualize every detail, texture, and color palette in your actual space before spending a single dollar on renovation. It’s not just a render—it’s your future home.</p>
                    <Button size="lg" onClick={() => setState(prev => ({ ...prev, view: 'studio' }))} className="bg-[#154845] hover:bg-black text-white border-none shadow-2xl">Try for free <ArrowRight size={20} className="ml-2" /></Button>
                </div>
                <div className="flex-1 relative flex items-center justify-center order-1 md:order-2 py-10">
                    <div className="relative z-10 -rotate-3 transform transition-transform hover:rotate-0 duration-500 group">
                        <img src={featureBefore.src} className="w-56 h-56 md:w-64 md:h-64 object-cover rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-[6px] border-white group-hover:scale-105 transition-transform" alt="Before Room" />
                         <div className="absolute top-5 left-5 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-bold">Original</div>
                    </div>
                    <div className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-full md:-translate-y-3/4"><div className="bg-white p-3 rounded-full shadow-xl text-[#C26D53]"><Sparkles size={32} fill="currentColor" className="animate-pulse"/></div></div>
                    <div className="relative z-10 translate-x-6 translate-y-10 rotate-3 transform transition-transform hover:rotate-0 duration-500 group">
                        <img src={featureAfter.src} className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-[2rem] shadow-[0_30px_60px_rgba(21,72,69,0.25)] border-[6px] border-white group-hover:scale-105 transition-transform" alt="After Room" />
                        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur pl-2 pr-5 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-3 text-[#154845]"><div className="bg-[#E6E2DE] p-1.5 rounded-full text-[#154845]"><Zap size={14} fill="currentColor"/></div>Dream Result</div>
                    </div>
                </div>
            </div>
        </section>

        <section className="w-full py-24 bg-[#154845] text-white text-center px-6 rounded-b-[3rem] mb-10 mx-6 max-w-[95%]">
           <h2 className="text-4xl font-extrabold mb-6">Ready to dream?</h2>
           <p className="text-[#E6E2DE] max-w-lg mx-auto mb-10 font-medium text-lg">Join thousands of homeowners creating their dream spaces today.</p>
           <Button variant="primary" size="lg" onClick={() => setState(prev => ({ ...prev, view: 'studio' }))} className="bg-[#C26D53] text-white hover:bg-[#A5563D] border-none px-12 py-4 text-lg">Design Your Room Now</Button>
           <div className="mt-16 pt-8 border-t border-white/10 flex justify-center">
             <button onClick={() => setShowAdmin(true)} className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors">
                Admin Access
             </button>
           </div>
        </section>
      </div>
    );
  };

  const renderPricing = () => {
    const tiers = [
        { creditsVal: 5, credits: '5 credits', description: ['5 room redesigns', 'Every design available'], price: 'US $9', isPopular: false },
        { creditsVal: 15, credits: '15 credits', description: ['15 room redesigns', 'Every design available'], price: 'US $19', isPopular: true },
        { creditsVal: 40, credits: '40 credits', description: ['40 room redesigns', 'Every design available'], price: 'US $29', isPopular: false }
    ];

    return (
        <div className="flex flex-col items-center min-h-screen font-sans bg-gradient-to-br from-[#F9F8F6] via-[#F9F8F6] to-[#EFEBE0]">
            {renderNavbar()}
            <section className="w-full max-w-6xl mx-auto px-6 pt-36 pb-20">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-4xl font-extrabold text-[#154845]">Buy DreamDesign Credits</h2>
                    <p className="text-lg text-[#64748B] font-medium">You have <span className="text-[#C26D53] font-bold text-xl">{state.user?.credits || 0} credits</span>. Join thousands of happy customers by buying more below.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                    {tiers.map((tier, index) => (
                        <div key={index} className={`relative rounded-[2rem] h-full flex flex-col p-8 ${tier.isPopular ? 'bg-[#154845] text-white shadow-2xl z-10' : 'bg-white text-[#154845] border-2 border-[#E2E8F0] shadow-lg'}`}>
                             {tier.isPopular && (<div className="absolute top-0 left-0 w-full bg-[#1A5D59] text-white text-center text-sm font-bold py-3 uppercase tracking-widest rounded-t-[2rem]">Most Popular</div>)}
                            <div className={`flex flex-col h-full ${tier.isPopular ? 'pt-6' : ''}`}>
                                <div className={`inline-block px-6 py-2.5 rounded-full font-bold text-lg mb-6 w-max ${tier.isPopular ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#154845]'}`}>{tier.credits}</div>
                                <div className="space-y-1 mb-8">{tier.description.map((line, i) => (<p key={i} className={`font-medium ${tier.isPopular ? 'text-white/90' : 'text-[#64748B]'}`}>{line}</p>))}</div>
                                <div className="text-5xl font-bold mb-8 tracking-tight mt-auto">{tier.price}</div>
                                <button className={`w-full py-4 rounded-xl font-bold text-lg transition-transform active:scale-95 ${tier.isPopular ? 'bg-white text-[#154845] hover:bg-gray-50' : 'bg-[#C26D53] text-white hover:bg-[#A5563D]'}`} onClick={() => buyCredits(tier.creditsVal)}>Pay now</button>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="mb-20 text-center text-[#94A3B8] text-sm font-bold uppercase tracking-wide flex flex-col md:flex-row justify-center gap-8 md:gap-12"><span className="flex items-center justify-center gap-2"><ShieldCheck size={20} className="text-[#154845]" /> No subscription</span><span className="flex items-center justify-center gap-2"><Infinity size={20} className="text-[#154845]" /> Credits never expire</span><span className="flex items-center justify-center gap-2"><CreditCard size={20} className="text-[#154845]" /> Secure payment</span></div>
                <div className="mb-20">
                    <h3 className="text-3xl font-extrabold text-[#154845] text-center mb-12">Why Homeowners Love Redesign Credits</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{[{ title: "Instant results", desc: "See your room reimagined in seconds." }, { title: "Avoid mistakes", desc: "Test paint colors & styles before buying." }, { title: "Save money", desc: "Much cheaper than hiring a real designer." }, { title: "Real Estate", desc: "Stage empty rooms to sell homes faster." }, { title: "Renovations", desc: "Visualize construction changes instantly." }, { title: "Fun & Addictive", desc: "Explore 20+ styles on your own photos." }].map((item, i) => (<div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]"><div className="w-10 h-10 bg-[#E6E2DE] rounded-full flex items-center justify-center text-[#154845] mb-4"><Check size={20} strokeWidth={3} /></div><h4 className="font-bold text-[#154845] text-lg mb-2">{item.title}</h4><p className="text-[#64748B] font-medium">{item.desc}</p></div>))}</div>
                </div>
            </section>
        </div>
    );
  };

  const renderStudio = () => {
    // Uses dynamicStyles instead of static STYLE_OPTIONS
    const visibleStyles = showAllStyles ? dynamicStyles : dynamicStyles.slice(0, 8);
    const selectedRoom = ROOM_OPTIONS.find(r => r.id === state.selectedRoomType);
    const activeGeneratedImage = state.generatedImages.length > 0 ? state.generatedImages[state.activeResultIndex] : null;
    const generationCost = state.selectedStyles.length;

    return (
    <div className="flex h-screen overflow-hidden bg-[#F9F8F6] font-sans">
      <div className="w-[420px] flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-20 flex items-center px-8 border-b border-[#F1F5F9] flex-shrink-0 justify-between">
             <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setState(prev => ({ ...prev, view: 'landing' }))}>
                <div className="bg-[#154845] text-white p-1 rounded-md"><Sparkles size={16} fill="currentColor" /></div>
                <span className="font-bold text-xl text-[#154845] tracking-tight group-hover:text-[#C26D53] transition-colors">DreamDesign</span>
            </div>
            <button onClick={resetProject} className="text-xs font-bold text-[#64748B] hover:text-[#C26D53] flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-[#F3F4F6]"><RefreshCw size={14}/> Start Over</button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            <section>
                <div className="flex justify-between items-baseline mb-3"><h3 className="font-bold text-lg text-[#154845]">1. Your Space</h3>{state.originalImage && (<button onClick={() => fileInputRef.current?.click()} className="text-xs text-[#C26D53] font-bold hover:underline">Change</button>)}</div>
                {!state.originalImage ? (
                    <div onClick={() => fileInputRef.current?.click()} className="h-36 border-2 border-dashed border-[#CBD5E1] rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#C26D53] hover:bg-[#F9F8F6]/50 transition-all duration-300 group gap-4 px-4">
                        <div className="w-12 h-12 bg-[#F1F5F9] text-[#94A3B8] rounded-full flex-shrink-0 flex items-center justify-center group-hover:bg-[#C26D53] group-hover:text-white transition-all shadow-sm"><Upload size={20} strokeWidth={2.5} /></div>
                        <div className="text-left"><span className="block text-base font-bold text-[#334155] group-hover:text-[#C26D53]">Upload Photo</span><span className="block text-xs text-[#94A3B8] font-medium">JPG or PNG supported</span></div>
                    </div>
                ) : (
                    <div className="relative h-36 rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-[#E2E8F0]" onClick={() => fileInputRef.current?.click()}>
                        <img src={state.originalImage} alt="Original" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center"><span className="opacity-0 group-hover:opacity-100 bg-white text-[#154845] text-xs font-bold px-4 py-2 rounded-full shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all">Replace</span></div>
                    </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </section>
            <section>
                <h3 className="font-bold text-lg text-[#154845] mb-3">2. Room Type</h3>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)} className={`w-full bg-white border flex items-center justify-between py-3.5 px-4 rounded-xl transition-all shadow-sm ${isRoomDropdownOpen ? 'border-[#C26D53] ring-4 ring-[#C26D53]/5' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'}`}>
                         <div className="flex items-center gap-3">{selectedRoom ? (<><div className="text-[#C26D53] bg-[#FDF2F0] p-1.5 rounded-lg">{selectedRoom.icon}</div><span className="font-bold text-[#154845]">{selectedRoom.label}</span></>) : (<span className="text-[#94A3B8] font-medium">Select a room...</span>)}</div>
                         <ChevronDown size={18} className={`text-[#64748B] transition-transform ${isRoomDropdownOpen ? 'rotate-180' : ''}`}/>
                    </button>
                    {isRoomDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto custom-scrollbar">
                            {ROOM_OPTIONS.map((room) => (
                                <div key={room.id} onClick={() => { setState(prev => ({ ...prev, selectedRoomType: room.id })); setIsRoomDropdownOpen(false); }} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${state.selectedRoomType === room.id ? 'bg-[#FDF2F0] text-[#C26D53]' : 'text-[#475569] hover:bg-[#F8FAFC]'}`}>
                                    <div className={state.selectedRoomType === room.id ? 'text-[#C26D53]' : 'text-[#94A3B8]'}>{room.icon}</div><span className="font-bold text-sm">{room.label}</span>{state.selectedRoomType === room.id && <Check size={16} className="ml-auto"/>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <section>
                <div className="flex justify-between items-baseline mb-3"><h3 className="font-bold text-lg text-[#154845]">3. Dream Style</h3><span className="text-xs text-[#64748B] font-bold">Select multiple</span></div>
                <div className="grid grid-cols-2 gap-3">
                    {visibleStyles.map((style) => {
                        const isSelected = state.selectedStyles.includes(style.id);
                        return (
                        <div key={style.id} onClick={() => toggleStyle(style.id)} className={`group relative rounded-xl overflow-hidden cursor-pointer border-4 transition-all aspect-[4/3] ${isSelected ? 'border-[#C26D53] shadow-lg scale-[1.02] z-10' : 'border-transparent'}`}>
                            <img src={style.image} alt={style.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className={`absolute inset-0 transition-colors duration-300 ${isSelected ? 'bg-black/20' : 'bg-black/10 group-hover:bg-black/20'}`} />
                            <div className="absolute bottom-2 left-2 right-2"><div className={`text-center py-1.5 rounded-lg backdrop-blur-md shadow-sm ${isSelected ? 'bg-[#C26D53] text-white' : 'bg-white/90 text-[#154845]'}`}><span className="text-[10px] uppercase font-extrabold block tracking-wide">{style.name}</span></div></div>
                            {isSelected && (<div className="absolute top-2 right-2 bg-[#C26D53] text-white p-1 rounded-full shadow-lg animate-in zoom-in spin-in-90 duration-300"><Check size={12} strokeWidth={4} /></div>)}
                        </div>
                    )})}
                </div>
                <div className="mt-6 text-center"><button onClick={() => setShowAllStyles(!showAllStyles)} className="text-xs font-bold text-[#C26D53] hover:text-[#154845] transition-colors hover:bg-[#F3F4F6] px-4 py-2 rounded-full uppercase tracking-wider">{showAllStyles ? "Show Less" : "Show More Styles"}</button></div>
            </section>
        </div>
        <div className="p-8 border-t border-[#F1F5F9] bg-white flex-shrink-0 z-30">
             <Button className="w-full shadow-xl shadow-[#154845]/20 py-4 text-lg" size="lg" disabled={!state.originalImage || !state.selectedRoomType || state.selectedStyles.length === 0 || state.isGenerating} isLoading={state.isGenerating} onClick={handleGenerate}>
                {state.isGenerating ? "Designing Space..." : !state.user ? "Log in to Redesign" : state.selectedStyles.length > 0 ? `Generate (${generationCost} ${generationCost === 1 ? 'Credit' : 'Credits'})` : "Generate Dream Design"} 
                {!state.isGenerating && state.generatedImages.length === 0 && <Sparkles size={20} className="ml-2" fill="currentColor" />}
            </Button>
             {state.user && state.selectedStyles.length > 0 && state.user.credits < generationCost && (<p className="text-center text-xs text-red-500 mt-2 font-bold">Insufficient credits. You need {generationCost} but have {state.user.credits}.</p>)}
            {(!state.originalImage || !state.selectedRoomType || state.selectedStyles.length === 0) && (<p className="text-center text-xs text-[#94A3B8] mt-4 font-bold bg-[#F8FAFC] py-2 rounded-lg">Complete all steps to unlock magic ✨</p>)}
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-[#F9F8F6] via-[#F9F8F6] to-[#EFEBE0]">
        <div className="flex-shrink-0 h-20 px-10 flex justify-between items-center z-10">
            <div><h2 className="text-3xl font-extrabold text-[#154845] tracking-tight">{state.generatedImages.length > 0 ? 'Your Dream Result' : 'Design Canvas'}</h2></div>
             {state.user && (
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md border border-white/50 px-4 py-2 rounded-full shadow-sm">
                    <div className="flex items-center gap-2"><div className="bg-[#FDF2F0] p-1.5 rounded-full text-[#C26D53]"><Zap size={16} fill="currentColor"/></div><span className="font-bold text-[#154845] text-lg">{state.user.credits}</span><span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide ml-1">Credits</span></div>
                    <div className="w-px h-6 bg-[#CBD5E1] mx-1"></div>
                    <button onClick={() => setIsCreditModalOpen(true)} className="text-xs font-bold text-[#C26D53] hover:text-[#154845] hover:underline uppercase tracking-wide transition-colors">Buy More</button>
                </div>
            )}
        </div>
        <div className="flex-1 relative p-8 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-6xl flex flex-col items-center">
                <div className={`relative transition-all duration-500 ${activeGeneratedImage ? 'p-2 rounded-[2.5rem] bg-white shadow-2xl' : 'w-full h-full max-h-[80vh] flex items-center justify-center'}`}>
                    {state.isGenerating ? (
                         <div className="w-full h-[60vh] bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_60px_rgba(21,72,69,0.05)] border-4 border-white"><LoadingScreen /></div>
                    ) : activeGeneratedImage && state.originalImage ? (
                        <div className="rounded-[2rem] overflow-hidden"><ComparisonSlider key={activeGeneratedImage.imageUrl} beforeImage={state.originalImage} afterImage={activeGeneratedImage.imageUrl} variant="default"/></div>
                    ) : state.originalImage ? (
                         <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-8 border-white bg-[#F1F5F9]">
                             <img src={state.originalImage} alt="Original Space" className="block max-w-full max-h-[75vh] w-auto h-auto object-contain"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"/>
                             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#154845] bg-white/90 backdrop-blur-md px-8 py-3 rounded-full text-base font-bold shadow-xl flex items-center gap-2"><Sparkles size={18} className="text-[#C26D53]" /> Ready to redesign</div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[60vh] w-full bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border-4 border-white text-[#94A3B8]">
                            <div className="w-24 h-24 bg-[#F8FAFC] rounded-[2rem] flex items-center justify-center mb-6 shadow-inner"><ImageIcon size={40} className="text-[#CBD5E1]"/></div>
                            <h3 className="font-bold text-2xl text-[#154845] mb-2">Start your project</h3>
                            <p className="max-w-xs text-center font-medium text-[#64748B]">Upload a photo from the sidebar to begin transforming your space.</p>
                        </div>
                    )}
                </div>
                {state.generatedImages.length > 0 && !state.isGenerating && (
                    <div className="flex gap-4 mt-6 overflow-x-auto pb-4 px-2 w-full justify-center hide-scrollbar">
                        {state.generatedImages.map((res, idx) => (
                            <button key={idx} onClick={() => setState(prev => ({...prev, activeResultIndex: idx}))} className={`relative group flex-shrink-0 w-32 flex flex-col items-center gap-2 transition-all duration-300 ${state.activeResultIndex === idx ? 'scale-110 z-10' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}>
                                <div className={`w-32 h-24 rounded-2xl overflow-hidden shadow-lg border-4 transition-colors ${state.activeResultIndex === idx ? 'border-[#C26D53]' : 'border-white group-hover:border-[#E2E8F0]'}`}><img src={res.imageUrl} alt={res.style} className="w-full h-full object-cover" /></div>
                                <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm ${state.activeResultIndex === idx ? 'bg-[#C26D53] text-white' : 'bg-white text-[#64748B]'}`}>{res.style}</span>
                            </button>
                        ))}
                        <div className="flex flex-col items-center justify-center w-32 h-24 rounded-2xl border-2 border-dashed border-[#CBD5E1] text-[#94A3B8] p-2 text-center cursor-pointer hover:border-[#C26D53] hover:text-[#C26D53] transition-colors" onClick={() => setIsStyleModalOpen(true)}><span className="text-xs font-bold">Try another style?</span></div>
                    </div>
                )}
                {activeGeneratedImage && !state.isGenerating && (
                    <div className="flex items-center gap-4 mt-4 animate-in slide-in-from-bottom-4 fade-in duration-700">
                         <Button variant="secondary" className="bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] font-bold" onClick={() => { setState(prev => ({ ...prev, originalImage: null, generatedImages: [], selectedStyles: [] })); if (fileInputRef.current) fileInputRef.current.value = ''; }}><RefreshCw size={20} className="mr-2"/> Redesign Another</Button>
                        <Button variant="primary" className="shadow-xl shadow-[#154845]/20 font-bold" onClick={() => { const link = document.createElement('a'); link.href = activeGeneratedImage.imageUrl; link.download = `dream-design-${activeGeneratedImage.style.toLowerCase()}.png`; link.click(); }}><Download size={20} className="mr-2"/> Download Render</Button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
  } // End renderStudio

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
       {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
       {isCreditModalOpen && <CreditTopUpModal />}
       {isStyleModalOpen && <StyleSuggestionModal />}
       
       {state.view === 'landing' && renderLanding()}
       {state.view === 'pricing' && renderPricing()}
       {state.view === 'studio' && renderStudio()}
       {state.view === 'auth' && (
          <AuthPage 
            initialView={state.authView}
            onLogin={(user) => setState(prev => ({ ...prev, user, view: 'studio' }))}
            onSwitch={(v) => setState(prev => ({ ...prev, authView: v }))}
            demos={heroDemos}
          />
       )}
    </div>
  );
}
