import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Pin as PinIcon, Moon, Sun, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function MobileLayout({
    isLightMode,
    setIsLightMode,
    isColorPinned,
    setIsColorPinned
}) {
    // --- LOCAL STATE for Mobile interactions ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [iconsSide, setIconsSide] = useState('right');
    const [isDraggingIcons, setIsDraggingIcons] = useState(false);
    const [showDragHint, setShowDragHint] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // --- REFS ---
    const dragStartRef = useRef({ x: 0, y: 0 });
    const longPressTimerRef = useRef(null);
    const hintHideTimerRef = useRef(null);
    const wasDraggingRef = useRef(false);
    const hasShownHintRef = useRef(false);
    const wasMenuOpenRef = useRef(false);

    // Trigger Hint on Menu Close
    useEffect(() => {
        if (isMenuOpen) {
            wasMenuOpenRef.current = true;
        } else {
            if (wasMenuOpenRef.current && !hasShownHintRef.current) {
                setShowDragHint(true);
                hasShownHintRef.current = true;
                clearTimeout(hintHideTimerRef.current);
                hintHideTimerRef.current = setTimeout(() => {
                    setShowDragHint(false);
                }, 3000);
            }
        }
    }, [isMenuOpen]);

    // Add Animation Style
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
      @keyframes shuttle-left { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-5px); } }
      @keyframes shuttle-right { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
      .animate-shuttle-left { animation: shuttle-left 1s ease-in-out infinite; }
      .animate-shuttle-right { animation: shuttle-right 1s ease-in-out infinite; }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const handleMenuPointerDown = (e) => {
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        wasDraggingRef.current = false;
        clearTimeout(hintHideTimerRef.current);

        longPressTimerRef.current = setTimeout(() => {
            setIsDraggingIcons(true);
            setShowDragHint(false);
            wasDraggingRef.current = true;
            if (navigator.vibrate) navigator.vibrate(50);
            e.target.setPointerCapture(e.pointerId);
        }, 600);
    };

    const handleMenuPointerMove = (e) => {
        const clientX = e.clientX;
        const clientY = e.clientY;

        if (isDraggingIcons) {
            setDragOffset({
                x: clientX - dragStartRef.current.x,
                y: clientY - dragStartRef.current.y
            });
        } else {
            const dist = Math.hypot(clientX - dragStartRef.current.x, clientY - dragStartRef.current.y);
            if (dist > 20) {
                clearTimeout(longPressTimerRef.current);
            }
        }
    };

    const handleMenuPointerUp = (e) => {
        clearTimeout(longPressTimerRef.current);

        if (isDraggingIcons) {
            setIsDraggingIcons(false);
            e.target.releasePointerCapture(e.pointerId);

            if (e.clientX < window.innerWidth / 2) {
                setIconsSide('left');
            } else {
                setIconsSide('right');
            }
            setDragOffset({ x: 0, y: 0 });
        }
    };

    const handleMenuClick = (e) => {
        e.stopPropagation();
        if (wasDraggingRef.current) {
            wasDraggingRef.current = false;
            return;
        }
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="relative z-10 block w-full pointer-events-auto md:hidden min-h-screen">
            {/* Floating Controls */}
            <div
                className={`fixed top-0 p-4 z-50 flex flex-col items-center gap-2 md:hidden pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]`}
                style={{
                    right: iconsSide === 'right' ? 0 : 'auto',
                    left: iconsSide === 'left' ? 0 : 'auto',
                    transform: isDraggingIcons ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'none',
                    transition: isDraggingIcons ? 'none' : 'all 0.5s cubic-bezier(0.32, 0.72, 0, 1)'
                }}
            >
                {/* WRAPPER FOR MENU + TOOLTIP */}
                <div className="relative flex items-center justify-center">
                    {/* DRAG HINT TOOLTIP */}
                    <div
                        className={`absolute pointer-events-none transition-opacity duration-300 ${showDragHint ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            top: '50%',
                            right: iconsSide === 'right' ? '100%' : 'auto',
                            left: iconsSide === 'left' ? '100%' : 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexDirection: iconsSide === 'left' ? 'row' : 'row-reverse',
                            marginRight: iconsSide === 'right' ? '12px' : '0',
                            marginLeft: iconsSide === 'left' ? '12px' : '0',
                            transform: 'translateY(-50%)',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <span className={`text-xs uppercase tracking-widest font-bold ${isLightMode ? 'text-black' : 'text-white'}`}>Drag Me</span>
                        {iconsSide === 'right' ? (
                            <ChevronsLeft size={18} className={`${isLightMode ? 'text-black' : 'text-white'} animate-shuttle-left`} />
                        ) : (
                            <ChevronsRight size={18} className={`${isLightMode ? 'text-black' : 'text-white'} animate-shuttle-right`} />
                        )}
                    </div>

                    {/* Menu Button */}
                    <button
                        className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${isLightMode ? 'border-black/20 hover:bg-black/10' : 'border-white/20 hover:bg-white/10'}`}
                        onPointerDown={handleMenuPointerDown}
                        onPointerMove={handleMenuPointerMove}
                        onPointerUp={handleMenuPointerUp}
                        onPointerLeave={handleMenuPointerUp}
                        onClick={handleMenuClick}
                        style={{
                            color: isLightMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
                            touchAction: 'none',
                            cursor: isDraggingIcons ? 'grabbing' : 'pointer',
                            zIndex: 20,
                            transform: isDraggingIcons ? 'scale(1.2)' : 'scale(1)',
                            transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)'
                        }}
                    >
                        {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>

                {/* Theme Button */}
                <button
                    className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${isLightMode ? 'border-black/20 hover:bg-black/10' : 'border-white/20 hover:bg-white/10'}`}
                    onClick={(e) => { e.stopPropagation(); setIsLightMode(!isLightMode); }}
                    style={{
                        color: isLightMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
                        zIndex: 10,
                        opacity: isDraggingIcons ? 0 : 1,
                        transform: isDraggingIcons ? 'translateY(-50px) scale(0.5)' : 'translateY(0) scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.32, 0.72, 0, 1)'
                    }}
                >
                    {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
                </button>

                {/* Pin Button */}
                <button
                    className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${isLightMode ? 'border-black/20 hover:bg-black/10' : 'border-white/20 hover:bg-white/10'} ${isColorPinned ? (isLightMode ? 'bg-black/20' : 'bg-white/20') : ''}`}
                    onClick={(e) => { e.stopPropagation(); setIsColorPinned(!isColorPinned); }}
                    style={{
                        color: isLightMode ? (isColorPinned ? '#000' : 'rgba(0,0,0,0.6)') : (isColorPinned ? '#fff' : 'rgba(255,255,255,0.6)'),
                        zIndex: 5,
                        opacity: isDraggingIcons ? 0 : 1,
                        transform: isDraggingIcons ? 'translateY(-100px) scale(0.5)' : 'translateY(0) scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.32, 0.72, 0, 1)'
                    }}
                >
                    <PinIcon size={16} className={isColorPinned ? "fill-current" : ""} />
                </button>
            </div>

            {/* Menu Overlay */}
            <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-transform duration-500 flex flex-col items-center justify-center gap-6 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* MENU CONTENT WOULD GO HERE */}
                <div className="text-white text-opacity-50">Mobile Menu Open</div>
            </div>

            {/* CONTENT WOULD GO HERE */}
            <div className="flex items-center justify-center h-full pt-32 text-center opacity-50">
                Mobile View Content
            </div>
        </div>
    );
}
