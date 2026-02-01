import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Plus, Pin as PinIcon, Menu, X } from 'lucide-react';
import { ScaleText, HackerText } from './TextEffects';
import gsap from 'gsap';

export default function MobileLayout({
    activePage,
    handlePageChange,
    isLightMode,
    setIsLightMode,
    theme,
    colorScheme,
    nameColor,
    roles,
    currentRoleIndex,
    isColorPinned,
    setIsColorPinned
}) {
    // --- LOCAL STATE ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [bioIndex, setBioIndex] = useState(0);

    // --- REFS ---
    const scrollContainerRef = useRef(null);
    const homeRef = useRef(null);
    const aboutRef = useRef(null);
    const workRef = useRef(null);

    // --- BIO ROTATION ---
    useEffect(() => {
        let timeout;
        const scheduleNext = () => {
            const delay = Math.random() * 5000 + 5000;
            timeout = setTimeout(() => {
                setBioIndex(prev => (prev + 1) % 2);
                scheduleNext();
            }, delay);
        };
        scheduleNext();
        return () => clearTimeout(timeout);
    }, []);

    // Scroll Handler for Menu
    const scrollToSection = (ref) => {
        if (ref.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const element = ref.current;
            const offsetTop = element.offsetTop;
            container.scrollTo({ top: offsetTop, behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    const bios = [
        // Bio 1: Empowering...
        (
            <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-wrap justify-end gap-2"><span className={`${theme.highlight}`}><HackerText text="EMPOWERING" /></span></div>
                <div className="flex flex-wrap justify-end gap-2"><span className={`${theme.highlight}`}><HackerText text="Creative" /></span><span className={`${theme.highlight}`}><HackerText text="TEAMS" /></span><span className={`${theme.muted}`}><HackerText text="to" /></span></div>
                <div className="flex flex-wrap justify-end gap-2"><span className={`${theme.highlight}`}><HackerText text="SCALE" /></span><span className={`${theme.highlight}`}><HackerText text="PRODUCTION" /></span></div>
                <div className="flex flex-wrap justify-end gap-2"><span className={`${theme.muted}`}><HackerText text="without" /></span><span className={`${theme.muted}`}><HackerText text="compromising" /></span></div>
                <div className="flex flex-wrap justify-end gap-2"><span className={`${theme.highlight}`}><HackerText text="INTEGRITY" /></span></div>
            </div>
        ),
        // Bio 2: AI didn't kill...
        (
            <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-wrap justify-end gap-2"><span className={`${theme.highlight}`}><HackerText text="AI" /></span><span className={`${theme.muted}`}><HackerText text="didn't" /></span></div>
                <div className="flex flex-wrap justify-end gap-2"><span className={`${theme.muted}`}><HackerText text="kill" /></span><span className={`${theme.highlight}`}><HackerText text="DESIGN" /></span><span className={`${theme.muted}`}>;</span><span className={`${theme.muted}`}><HackerText text="it" /></span></div>
                <div className="flex flex-wrap justify-end gap-2"><span className={`${theme.highlight}`}><HackerText text="is" /></span><span className={`${theme.highlight}`}><HackerText text="PART" /></span><span className={`${theme.highlight}`}><HackerText text="of" /></span></div>
                <div className="flex flex-wrap justify-end gap-2"><span className={`${theme.muted}`}><HackerText text="the" /></span><span className={`${theme.highlight}`}><HackerText text="FUTURE" /></span></div>
                <div className="flex flex-wrap justify-end gap-2"><span className={`${theme.highlight}`}><HackerText text="DESIGN" /></span></div>
            </div>
        )
    ];

    return (
        <div className={`relative h-screen md:hidden ${isMenuOpen ? 'overflow-hidden' : ''}`}>

            {/* ========================================== */}
            {/* LAYER 1: TOP UI - Fixed at top & bottom   */}
            {/* ========================================== */}

            {/* Menu Button - Top Right */}
            <div className="fixed top-4 right-4 z-50">
                <div className="flex flex-col gap-2 bg-black/20 backdrop-blur-md rounded-full p-2 border border-white/10 shadow-lg">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 bg-white text-black rounded-full shadow-lg active:scale-90 transition-transform">
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <button onClick={() => setIsColorPinned(!isColorPinned)} className={`p-2.5 rounded-full transition-all ${isColorPinned ? 'bg-white text-black' : 'bg-transparent text-white'}`}>
                        <PinIcon size={18} className={isColorPinned ? 'fill-current' : ''} />
                    </button>
                    <button onClick={() => setIsLightMode(!isLightMode)} className="p-2.5 rounded-full bg-transparent text-white">
                        {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                </div>
            </div>

            {/* Scroll Indicator - Fixed Bottom Left */}
            <div className={`fixed bottom-6 left-6 z-40 text-[10px] uppercase tracking-widest opacity-50 animate-pulse ${theme.text} pointer-events-none`}>
                Scroll ↓
            </div>

            {/* Footer Info - Fixed Bottom Right */}
            <div className={`fixed bottom-6 right-6 z-40 text-[10px] uppercase tracking-widest opacity-50 text-right ${theme.text} pointer-events-none`}>
                <div>Based in Malaysia</div>
                <div>© 2026</div>
            </div>

            {/* Full Screen Menu Overlay */}
            <div className={`fixed inset-0 z-[45] bg-black/95 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center gap-8 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {[
                    { name: 'Home', ref: homeRef },
                    { name: 'Vinz Tan', ref: aboutRef },
                    { name: 'Projects', ref: workRef }
                ].map((item) => (
                    <button
                        key={item.name}
                        onClick={() => scrollToSection(item.ref)}
                        className="text-4xl font-bold uppercase tracking-widest text-white hover:text-gray-300 transition-colors"
                        style={{ color: item.name === 'Vinz Tan' ? nameColor : 'inherit' }}
                    >
                        {item.name}
                    </button>
                ))}
                <div className="mt-8 flex gap-8 text-sm text-white/60">
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="mailto:hello@vinztan.com" className="hover:text-white transition-colors">Email</a>
                </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 2: CENTER - Scrollable Content      */}
            {/* ========================================== */}
            <div
                ref={scrollContainerRef}
                className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {/* Add padding at bottom for overscroll effect */}
                <div className="flex flex-col w-full">

                    {/* SECTION: HOME */}
                    <section ref={homeRef} className="min-h-screen w-full flex flex-col justify-between px-6 py-16 relative">
                        {/* Top Name/Role */}
                        <div className="flex flex-col gap-2 pointer-events-none">
                            <h1 className="text-xl font-bold tracking-[0.2em] uppercase" style={{ color: nameColor }}>Vinz Tan</h1>
                            <div className="flex flex-col text-xs font-light tracking-widest opacity-80">
                                {roles[currentRoleIndex].split(' ').map((word, i) => (
                                    <span key={i} className={i === 0 ? "font-bold" : ""}>{word}</span>
                                ))}
                            </div>
                        </div>

                        {/* Rotating Bio Content */}
                        <div className="flex-1 flex flex-col justify-center items-end text-right py-8">
                            <div className="text-[9vw] font-bold leading-none tracking-tighter mix-blend-difference">
                                {bios[bioIndex]}
                            </div>
                        </div>

                        {/* Spacer for bottom UI */}
                        <div className="h-12"></div>
                    </section>

                    {/* SECTION: ABOUT */}
                    <section ref={aboutRef} className="min-h-screen w-full flex flex-col justify-center px-6 py-20 gap-8 relative">
                        <h2 className="text-[15vw] font-bold uppercase tracking-tighter opacity-10 absolute top-10 right-[-5vw] pointer-events-none select-none">About</h2>

                        {/* Picture Block */}
                        <div className={`w-full aspect-square max-w-sm mx-auto rounded-2xl border ${theme.border} bg-white/5 backdrop-blur-sm relative overflow-hidden flex items-center justify-center`}>
                            <span className={`text-sm uppercase tracking-widest ${theme.subText}`}>Picture</span>
                            <div className="absolute inset-0 opacity-20 pointer-events-none bg-noise"></div>
                        </div>

                        {/* Expertise */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['Creative Ops Strategy', 'Hybrid Workflow Design', 'AIGC Pipeline Arch.', 'Art Direction', 'Brand Systems', 'Tech-Art Leadership'].map((skill, i) => (
                                <div key={i} className={`px-3 py-2 rounded border ${theme.border} text-center uppercase tracking-wider text-[10px] bg-transparent whitespace-normal`}>
                                    {skill}
                                </div>
                            ))}
                        </div>

                        {/* Bio Text */}
                        <div className={`${theme.text} p-4 rounded-xl bg-black/5 backdrop-blur-sm text-sm leading-relaxed text-justify space-y-4 border ${theme.border}`}>
                            <p>Hi, I'm Vinz, I help Creative Teams escape production limits and maximize their impact.</p>
                            <p>With over 12 years of experience as a Lead Artist and Educator, I bridge the gap between traditional artistry and modern efficiency.</p>
                        </div>
                    </section>

                    {/* SECTION: WORK */}
                    <section ref={workRef} className="min-h-screen w-full flex flex-col justify-center px-6 py-20 gap-8 relative">
                        <h2 className="text-[15vw] font-bold uppercase tracking-tighter opacity-10 absolute top-10 left-[-2vw] pointer-events-none select-none">Work</h2>

                        <div className="flex flex-col items-end text-right space-y-6">
                            <h3 className="text-4xl font-bold uppercase tracking-wide" style={{ color: colorScheme.base }}>Featured Projects</h3>
                            <div className="w-20 h-1 bg-current" style={{ color: colorScheme.compString }}></div>
                            <p className={`${theme.text} text-lg leading-relaxed max-w-md`}>
                                Featured projects and case studies coming soon. I specialize in AI-driven creative solutions and strategic implementations.
                            </p>
                        </div>
                    </section>

                    {/* Extra padding at end for overscroll "pull" effect */}
                    <div className="h-32 flex items-center justify-center">
                        <span className={`text-[10px] uppercase tracking-widest ${theme.subText} opacity-50`}>— End —</span>
                    </div>
                </div>
            </div>

            {/* ========================================== */}
            {/* LAYER 3: BOTTOM - Backgrounds             */}
            {/* (Already handled in App.jsx - z-0 to z-5) */}
            {/* ========================================== */}

        </div>
    );
}
