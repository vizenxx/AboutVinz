import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

// --- SCALE TEXT COMPONENT ---
export const ScaleText = ({ children, className, lineHeight = 0.8 }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useLayoutEffect(() => {
        const resize = () => {
            const container = containerRef.current;
            const text = textRef.current;

            if (container && text) {
                const baseFontSize = 100;
                text.style.fontSize = `${baseFontSize}px`;
                text.style.width = 'max-content';

                const containerW = container.getBoundingClientRect().width;
                const textW = text.getBoundingClientRect().width;

                // 0.99 Buffer prevents width clipping
                const ratio = (containerW / textW) * 0.99;

                text.style.width = '100%';
                text.style.fontSize = `${baseFontSize * ratio}px`;
            }
        };

        resize();
        if (document.fonts) {
            document.fonts.ready.then(resize);
        }

        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [children]);

    return (
        <div
            ref={containerRef}
            className={`w-full overflow-hidden ${className || ''}`}
            style={{ paddingBottom: '0.3rem' }}
        >
            <span
                ref={textRef}
                style={{
                    display: 'block',
                    lineHeight: lineHeight,
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    transformOrigin: 'left top'
                }}
            >
                {children}
            </span>
        </div>
    );
};

// --- HACKER TEXT COMPONENT ---
export const HackerText = ({ text, className, speed = 30 }) => {
    const [displayText, setDisplayText] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    const intervalRef = useRef(null);
    const triggerEffect = () => {
        let iteration = 0;
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setDisplayText(prev => text.split("").map((letter, index) => { if (index < iteration) return text[index]; return chars[Math.floor(Math.random() * chars.length)]; }).join(""));
            if (iteration >= text.length) clearInterval(intervalRef.current);
            iteration += 1 / 3;
        }, speed);
    };
    useEffect(() => { triggerEffect(); return () => clearInterval(intervalRef.current); }, [text]);
    return <span className={`inline-block ${className}`} onMouseEnter={triggerEffect}>{displayText}</span>;
};
