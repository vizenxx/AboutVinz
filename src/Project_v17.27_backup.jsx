import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

const projectData = {
    title: "LuckBros Mural Visual Design",
    subtitle: "AIGC INTEGRATED SPATIAL DESIGN",
    meta: [
        { label: "Cooperator", value: "Rising Formula" },
        { label: "Type", value: "Mural & Branding" },
    ],
    description: [
        {
            type: "pivot-group",
            items: [
                {
                    pivot: "Unlock greater impact by integrating AI",
                    targetId: "header",
                    paragraphs: [
                        "When we started the project, I thought AI would simply help speed things up. What I didn’t expect was how much better the results would turn out, not just for me but for the clients too. The outcomes were sharper, richer, and full of details that used to feel impossible.",
                        "It was so wonderful that the clients themselves saw the potential beyond the original mural. Instead of stopping there, they recognized the work could live on as brand visuals, proving that the impact was far greater than we first imagined."
                    ]
                },
                {
                    pivot: "Better quality, faster communication",
                    targetId: "main-mural",
                    paragraphs: [
                        "The ability to generate samples quickly changed the way we worked together. Clients and teammates could see visuals almost instantly, making discussions smoother and iterations faster. This gave us more freedom to explore deeper creative ideas without feeling rushed.",
                        "Communication became easier, and the quality of the work improved because everyone could respond in real time, making collaboration more engaging and productive."
                    ]
                },
                {
                    pivot: "Details stacked on details",
                    targetId: "artifacts",
                    paragraphs: [
                        "In the past, details often felt overwhelming, like a trap that consumed time and left no room to think. But with AI supporting the process, details became something we could embrace. I started layering facets and design considerations one by one, making sure targeted objects were accurate, enlargements were print‑ready, and the overall style stayed consistent.",
                        "What used to feel like “detail hell” turned into a space for thoughtful balance and refinement. It was surprising how enjoyable it became to push deeper into the details, knowing we had the tools to manage them."
                    ]
                },
                {
                    pivot: "From murals to full brand visuals",
                    targetId: "process-1",
                    paragraphs: [
                        "As the project progressed, something unexpected happened. Teammates and clients grew increasingly happy with how the design was shaping up. They began to see its potential not just as a mural but as a flexible brand visual. Together, we decided to take that step, and with AI helping to adapt and refine the artwork, the transition was smoother than anyone expected.",
                        "What started as a single mural was accepted as one of the major brand visual materials, carrying the story far beyond the wall and into the identity of the brand itself."
                    ]
                }
            ]
        }
    ],
    // Image Grid Configuration
    images: [
        { id: "header", src: "/portfolio-site/projects/case9/1.jpg", size: "big" },
        { id: "main-mural", src: "/portfolio-site/projects/case9/2.jpg", size: "big" },
        { id: "artifacts", src: "/portfolio-site/projects/case9/3.jpg", size: "big" },
        { id: "process-1", src: "/portfolio-site/projects/case9/4.jpg", size: "small" },
    ]
};

export default function Project({ theme, colorScheme, isLightMode, placement }) {
    const imageContainerRef = useRef(null);
    const narrativeRef = useRef(null);

    // Scroll Progress State
    const [imageProgress, setImageProgress] = useState(0);
    const [narrativeProgress, setNarrativeProgress] = useState(0);
    const [activeImageId, setActiveImageId] = useState(projectData.images[0].id);
    const activeImageIdRef = useRef(projectData.images[0].id);

    // Portal Targets
    const [portalTarget, setPortalTarget] = useState(null);
    const [rpcTarget, setRpcTarget] = useState(null);
    useEffect(() => {
        setPortalTarget(document.getElementById('right-panel-portal'));
        setRpcTarget(document.getElementById('project-rpc-target'));
    }, []);

    const scrollToImage = (id) => {
        const element = document.getElementById(`proj-img-${id}`);
        if (element && imageContainerRef.current) {
            const container = imageContainerRef.current;
            const top = element.offsetTop + element.offsetHeight / 2 - container.clientHeight / 2;

            // PHYSICS SYNC v14.3 - Forced Triggering
            const maxScroll = container.scrollHeight - container.clientHeight;
            scrollPhysics.current.targetY = Math.max(0, Math.min(top, maxScroll));
            scrollPhysics.current.isScrubbing = true;
            scrollPhysics.current.isDragging = false;
            scrollPhysics.current.momentum = 0;
            scrollPhysics.current.velocity = 0;
        }
    };

    const handleScrollUpdate = () => {
        if (!imageContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = imageContainerRef.current;

        // Update Scroll Progress
        if (scrollHeight > clientHeight) {
            setImageProgress(scrollTop / (scrollHeight - clientHeight));
        }
    };


    const handleNarrativeScroll = () => {
        if (!narrativeRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = narrativeRef.current;
        if (scrollHeight > clientHeight) {
            setNarrativeProgress(scrollTop / (scrollHeight - clientHeight));
        }
    };

    // Physics & Interaction State
    const scrubberTrackRef = useRef(null);
    const scrubberHandleRef = useRef(null);
    const scrubberLineRef = useRef(null);
    const scrollPhysics = useRef({
        currentY: 0,
        targetY: 0,
        velocity: 0,
        isDragging: false,
        isScrubbing: false,
        isManualScrubbing: false,
        isPointerDown: false,
        startY: 0,
        lastY: 0,
        momentum: 0
    });

    const narrativePhysics = useRef({
        currentY: 0,
        targetY: 0,
        velocity: 0,
        isDragging: false,
        isPointerDown: false,
        lastY: 0,
        momentum: 0
    });

    // Custom Scroll & Drag Logic
    useEffect(() => {
        const container = imageContainerRef.current;
        if (!container) return;

        let rafId;

        const handleWheel = (e) => {
            // Prevent native scroll and update target
            e.preventDefault();
            scrollPhysics.current.targetY += e.deltaY * 1.25; // Velocity Amp v12.0 (1.25x)
            // Clamp target
            const maxScroll = container.scrollHeight - container.clientHeight;
            scrollPhysics.current.targetY = Math.max(0, Math.min(scrollPhysics.current.targetY, maxScroll));
        };

        const handleMouseDown = (e) => {
            scrollPhysics.current.isPointerDown = true;
            scrollPhysics.current.isDragging = true;
            scrollPhysics.current.isScrubbing = false;
            scrollPhysics.current.startY = e.clientY;
            scrollPhysics.current.lastY = e.clientY;
            scrollPhysics.current.momentum = 0;
            // Change cursor
            container.style.cursor = 'grabbing';
        };

        const handleMouseMove = (e) => {
            if (!scrollPhysics.current.isDragging) return;
            const delta = (scrollPhysics.current.lastY - e.clientY) * 1.5; // Drag Amp v12.0 (1.25x of 1.2)
            scrollPhysics.current.lastY = e.clientY;

            // Drag target
            scrollPhysics.current.targetY += delta;

            // Interaction velocity for liquid distortion
            scrollPhysics.current.velocity = delta;

            const maxScroll = container.scrollHeight - container.clientHeight;
            scrollPhysics.current.targetY = Math.max(0, Math.min(scrollPhysics.current.targetY, maxScroll));
        };

        const handleMouseUp = () => {
            scrollPhysics.current.isPointerDown = false;
            scrollPhysics.current.isManualScrubbing = false;
            if (scrollPhysics.current.isDragging) {
                scrollPhysics.current.isDragging = false;
                container.style.cursor = 'grab';
                scrollPhysics.current.momentum = scrollPhysics.current.velocity;
            }
        };

        const handleScrubberMove = (e) => {
            if (!scrollPhysics.current.isManualScrubbing || !scrollPhysics.current.isPointerDown || !scrubberTrackRef.current) return;
            const rect = scrubberTrackRef.current.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const progress = Math.max(0, Math.min(1, y / rect.height));

            // Map progress back to scroll target
            const wrappers = container.querySelectorAll('.project-image-wrapper');
            if (wrappers.length >= 1) {
                const firstEl = wrappers[0];
                const lastEl = wrappers[wrappers.length - 1];
                const minSnap = firstEl.offsetTop + firstEl.offsetHeight / 2 - container.clientHeight / 2;
                const maxSnap = lastEl.offsetTop + lastEl.offsetHeight / 2 - container.clientHeight / 2;
                scrollPhysics.current.targetY = minSnap + progress * (maxSnap - minSnap);
            }
        };

        const updatePhysics = () => {
            const p = scrollPhysics.current;
            const maxScroll = container.scrollHeight - container.clientHeight;

            if (p.isScrubbing) {
                p.currentY += (p.targetY - p.currentY) * 0.18;
                // Auto-disable scrubbing state once reached target
                if (Math.abs(p.targetY - p.currentY) < 0.1) {
                    p.isScrubbing = false;
                    p.momentum = 0; // Ensure no leftover momentum pulls it back
                }
            } else if (!p.isDragging) {
                // Apply momentum
                p.targetY += p.momentum;
                p.momentum *= 0.97; // More glide

                // Soft Snap Logic - Disabled during active scrubbing
                if (!p.isScrubbing && (p.momentum === 0 || Math.abs(p.momentum) < 1.0)) {
                    const wrappers = container.querySelectorAll('.project-image-wrapper');
                    let nearestSnap = p.targetY;
                    let minDist = Infinity;

                    wrappers.forEach(el => {
                        let snapTarget = el.offsetTop + el.offsetHeight / 2 - container.clientHeight / 2;
                        // IMPORTANT: Clamp snap target to container boundaries for distance check
                        snapTarget = Math.max(0, Math.min(snapTarget, maxScroll));

                        const dist = Math.abs(snapTarget - p.targetY); // Snap based on INTENDED target
                        if (dist < minDist) {
                            minDist = dist;
                            nearestSnap = snapTarget;
                        }
                    });

                    // Snappier repositioning (Lock to "Slot")
                    p.targetY += (nearestSnap - p.targetY) * 0.10;
                }

                p.targetY = Math.max(0, Math.min(p.targetY, maxScroll));

                // Kill momentum immediately when hitting boundaries to prevent "floating"
                if (p.targetY <= 0 || p.targetY >= maxScroll) {
                    p.momentum = 0;
                }

                // Snappier Dynamic Lerp + Cutoff for "Infinite Tail"
                const diff = p.targetY - p.currentY;
                const lerpFactor = 0.1; // Unified elegant speed

                if (Math.abs(diff) < 0.0001) {
                    p.currentY = p.targetY;
                    p.momentum = 0;
                    p.isScrubbing = false;
                } else {
                    p.currentY += diff * lerpFactor;
                }
            } else {
                // Snappier drag catch-up
                p.currentY += (p.targetY - p.currentY) * 0.15;
            }

            // Sync native scroll
            container.scrollTop = p.currentY;

            // Derived Velocity for visuals
            const v = p.targetY - p.currentY;
            const vAbs = Math.abs(v);

            // 1. Refined Liquid Logic (Elasticity)
            const rotation = Math.max(-12, Math.min(12, v * 0.1));
            const scaleY = 1 + Math.min(vAbs * 0.0015, 0.15);
            const skew = Math.max(-6, Math.min(6, v * 0.06));

            const wrappers = container.querySelectorAll('.project-image-wrapper');
            wrappers.forEach(el => {
                el.style.transform = `perspective(1200px) rotateX(${rotation}deg) skewY(${skew}deg) scaleY(${scaleY})`;
            });

            // 2. Group Zoom (Depth)
            const groupWrapper = container.querySelector('.flex.flex-col');
            if (groupWrapper) {
                const groupScale = 1 - Math.min(vAbs * 0.0002, 0.04);
                groupWrapper.style.transform = `scale(${groupScale})`;
                groupWrapper.style.transformOrigin = 'center center';
            }

            // Update Progress for UI - Mapped to Snap Points
            if (wrappers.length >= 1) {
                const firstEl = wrappers[0];
                const lastEl = wrappers[wrappers.length - 1];
                const minSnap = firstEl.offsetTop + firstEl.offsetHeight / 2 - container.clientHeight / 2;
                const maxSnap = lastEl.offsetTop + lastEl.offsetHeight / 2 - container.clientHeight / 2;

                if (maxSnap !== minSnap) {
                    const progress = (p.currentY - minSnap) / (maxSnap - minSnap);
                    setImageProgress(progress);

                    // Zero-Latency Direct DOM Update (GSAP style)
                    if (scrubberHandleRef.current) {
                        scrubberHandleRef.current.style.top = `${Math.max(0, Math.min(1, progress)) * 100}%`;
                    }
                    if (scrubberLineRef.current) {
                        scrubberLineRef.current.style.height = `${Math.max(0, Math.min(1, progress)) * 100}%`;
                    }
                } else {
                    setImageProgress(0);
                }
            }

            // 3. Detect Active Image (for narrative sync)
            const rect_container = container.getBoundingClientRect();
            const center_container = rect_container.top + rect_container.height / 2;
            let currentActiveId = activeImageIdRef.current;
            let minDistance = Infinity;

            wrappers.forEach(el => {
                const rect_el = el.getBoundingClientRect();
                const center_el = rect_el.top + rect_el.height / 2;
                const distance = Math.abs(center_container - center_el);
                if (distance < minDistance) {
                    minDistance = distance;
                    const id = el.id.replace('proj-img-', '');
                    currentActiveId = id;
                }
            });

            if (currentActiveId !== activeImageIdRef.current) {
                activeImageIdRef.current = currentActiveId;
                setActiveImageId(currentActiveId);
            }

            rafId = requestAnimationFrame(updatePhysics);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        // Use window for mousemove/up to ensure drag isn't lost
        container.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousemove', handleScrubberMove);
        window.addEventListener('mouseup', handleMouseUp);

        rafId = requestAnimationFrame(updatePhysics);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousemove', handleScrubberMove);
            window.removeEventListener('mouseup', handleMouseUp);
            cancelAnimationFrame(rafId);
        };
    }, []);

    // NARRATIVE DRAG SCROLL v16.8
    useEffect(() => {
        if (!portalTarget || !narrativeRef.current) return;
        const narrative = narrativeRef.current;

        let rafId;
        const p = narrativePhysics.current;

        const handleWheel = (e) => {
            e.preventDefault();
            p.targetY += e.deltaY;
            const max = narrative.scrollHeight - narrative.clientHeight;
            p.targetY = Math.max(0, Math.min(p.targetY, max));
        };

        const handleMouseDown = (e) => {
            p.isPointerDown = true;
            p.isDragging = true;
            p.lastY = e.clientY;
            p.momentum = 0;
            narrative.style.cursor = 'grabbing';
        };

        const handleMouseMove = (e) => {
            if (!p.isDragging) return;
            const delta = p.lastY - e.clientY;
            p.lastY = e.clientY;
            p.targetY += delta * 1.5;
            p.velocity = delta * 1.5;
            const max = narrative.scrollHeight - narrative.clientHeight;
            p.targetY = Math.max(0, Math.min(p.targetY, max));
        };

        const handleMouseUp = () => {
            p.isPointerDown = false;
            if (p.isDragging) {
                p.isDragging = false;
                narrative.style.cursor = 'auto';
                p.momentum = p.velocity;
            }
        };

        const update = () => {
            const max = narrative.scrollHeight - narrative.clientHeight;
            if (max <= 0) {
                rafId = requestAnimationFrame(update);
                return;
            }

            if (!p.isDragging) {
                p.targetY += p.momentum;
                p.momentum *= 0.95;
                if (Math.abs(p.momentum) < 0.1) p.momentum = 0;
            }
            p.targetY = Math.max(0, Math.min(p.targetY, max));
            p.currentY += (p.targetY - p.currentY) * 0.1;

            narrative.scrollTop = p.currentY;
            setNarrativeProgress(p.currentY / max);

            rafId = requestAnimationFrame(update);
        };

        narrative.addEventListener('wheel', handleWheel, { passive: false });
        narrative.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        rafId = requestAnimationFrame(update);

        return () => {
            narrative.removeEventListener('wheel', handleWheel);
            narrative.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            cancelAnimationFrame(rafId);
        };
    }, [portalTarget]);

    // NARRATIVE AUTO-SCROLL TO ACTIVE PIVOT v16.11 - Adaptive Tracking
    useEffect(() => {
        if (!narrativeRef.current) return;

        let rafId;
        const startTime = Date.now();
        const duration = 850; // Follows the 700ms CSS transition + buffer

        const trackAndScroll = () => {
            const btn = document.getElementById(`pivot-btn-${activeImageId}`);
            if (btn && narrativeRef.current) {
                // By updating targetY continuously during the 700ms collapse animation,
                // we ensure the pivot title stays at the top as the space above it shrinks.
                const targetY = btn.offsetTop - 20;
                const max = narrativeRef.current.scrollHeight - narrativeRef.current.clientHeight;
                narrativePhysics.current.targetY = Math.max(0, Math.min(targetY, max));
            }

            if (Date.now() - startTime < duration) {
                rafId = requestAnimationFrame(trackAndScroll);
            }
        };

        rafId = requestAnimationFrame(trackAndScroll);
        return () => cancelAnimationFrame(rafId);
    }, [activeImageId]);

    useEffect(() => {
        handleScrollUpdate();
        window.addEventListener('resize', handleScrollUpdate);
        return () => window.removeEventListener('resize', handleScrollUpdate);
    }, []);


    return (
        <div
            className="w-full h-full flex flex-col justify-center pointer-events-auto overflow-visible"
            onWheel={(e) => e.stopPropagation()}
        >
            <div className={`w-full h-full flex flex-col md:flex-row relative overflow-visible`}>

                {/* LEFT: Image Section (Full Bleed / Zero Clipping) */}
                <div
                    className="w-full h-1/2 md:h-full relative min-w-0 flex-shrink-0 overflow-visible"
                >
                    <div
                        ref={imageContainerRef}
                        className="w-[110%] -ml-[5%] px-[5%] h-full overflow-y-auto scrollbar-none cursor-grab select-none relative"
                        onScroll={handleScrollUpdate}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', touchAction: 'none' }}
                    >
                        {/* Centered Images Inside Full-Bleed container */}
                        <div className="flex flex-col w-full gap-12 py-[50vh] transition-transform duration-150 overflow-visible relative">
                            {projectData.images.map((img) => {
                                if (img.size === 'empty') return null;
                                return (
                                    <div
                                        key={img.id}
                                        id={`proj-img-${img.id}`}
                                        className={`project-image-wrapper relative group overflow-visible flex-shrink-0 w-full h-auto rounded-[2px] will-change-transform`}
                                    >
                                        <img
                                            src={img.src}
                                            alt={img.id}
                                            draggable="false"
                                            className={`w-full h-auto block pointer-events-none transition-transform duration-700`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Scrubber Section */}
                    {rpcTarget ? createPortal(
                        <div
                            className="w-full pointer-events-auto flex items-center justify-center relative"
                            style={{ height: `${Math.min(30, projectData.images.filter(img => img.size !== 'empty').length * 5)}vh` }}
                        >
                            {/* Track Wrapper */}
                            <div
                                ref={scrubberTrackRef}
                                className="relative w-[2px] h-full bg-transparent flex flex-col items-center cursor-pointer group/track"
                                onPointerDown={(e) => {
                                    if (e.target === e.currentTarget) {
                                        e.stopPropagation();
                                        scrollPhysics.current.isPointerDown = true;
                                        scrollPhysics.current.isManualScrubbing = true;
                                        scrollPhysics.current.isScrubbing = false;
                                        scrollPhysics.current.momentum = 0;
                                        scrollPhysics.current.velocity = 0;
                                        const rect = scrubberTrackRef.current.getBoundingClientRect();
                                        const y = e.clientY - rect.top;
                                        const progress = Math.max(0, Math.min(1, y / rect.height));

                                        const container = imageContainerRef.current;
                                        const wrappers = container.querySelectorAll('.project-image-wrapper');
                                        if (wrappers.length >= 1) {
                                            const firstEl = wrappers[0];
                                            const lastEl = wrappers[wrappers.length - 1];
                                            const minSnap = firstEl.offsetTop + firstEl.offsetHeight / 2 - container.clientHeight / 2;
                                            const maxSnap = lastEl.offsetTop + lastEl.offsetHeight / 2 - container.clientHeight / 2;
                                            const jumpTarget = minSnap + progress * (maxSnap - minSnap);
                                            scrollPhysics.current.targetY = jumpTarget;
                                        }
                                    }
                                }}
                            >
                                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full bg-[#808080] opacity-30" />
                                {projectData.images.filter(img => img.size !== 'empty').map((img, idx, filtered) => {
                                    const posPercent = (idx / (filtered.length - 1)) * 100;
                                    const activeIndex = filtered.findIndex(f => f.id === activeImageId);
                                    const isTriggered = idx < activeIndex;
                                    const isTriggering = idx === activeIndex;
                                    const isEmpty = idx > activeIndex;

                                    return (
                                        <button
                                            key={img.id}
                                            onPointerDown={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                scrollToImage(img.id);
                                            }}
                                            className="absolute left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center group/dot z-[100] cursor-pointer"
                                            style={{ top: `${posPercent}%`, transform: 'translate(-50%, -50%)' }}
                                        >
                                            <div
                                                className={`relative rounded-full transition-all duration-300 flex items-center justify-center ${isTriggering ? 'w-3 h-3' : 'w-2 h-2'}`}
                                                style={{
                                                    backgroundColor: isEmpty ? '#808080' : colorScheme.compString,
                                                    opacity: 1
                                                }}
                                            />
                                        </button>
                                    );
                                })}
                                <div
                                    ref={scrubberHandleRef}
                                    className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-lg z-20 pointer-events-none opacity-0"
                                    style={{ top: '0%', transform: 'translate(-50%, -50%)', backgroundColor: isLightMode ? '#000' : '#fff' }}
                                />
                            </div>
                        </div>,
                        rpcTarget
                    ) : (
                        <div
                            className="absolute right-[-3vw] top-1/2 -translate-y-1/2 w-[2vw] z-50 pointer-events-auto flex items-center justify-center"
                            style={{ height: `${Math.min(30, projectData.images.filter(img => img.size !== 'empty').length * 5)}vh` }}
                        >
                            {/* Original inline scrubber for mobile/other contexts */}
                            <div
                                ref={scrubberTrackRef}
                                className="relative w-full h-full bg-transparent flex flex-col items-center cursor-pointer group/track"
                                onPointerDown={(e) => {
                                    if (e.target === e.currentTarget) {
                                        e.stopPropagation();
                                        scrollPhysics.current.isPointerDown = true;
                                        scrollPhysics.current.isManualScrubbing = true;
                                        scrollPhysics.current.isScrubbing = false;
                                        scrollPhysics.current.momentum = 0;
                                        scrollPhysics.current.velocity = 0;
                                        const rect = scrubberTrackRef.current.getBoundingClientRect();
                                        const y = e.clientY - rect.top;
                                        const progress = Math.max(0, Math.min(1, y / rect.height));

                                        const container = imageContainerRef.current;
                                        const wrappers = container.querySelectorAll('.project-image-wrapper');
                                        if (wrappers.length >= 1) {
                                            const firstEl = wrappers[0];
                                            const lastEl = wrappers[wrappers.length - 1];
                                            const minSnap = firstEl.offsetTop + firstEl.offsetHeight / 2 - container.clientHeight / 2;
                                            const maxSnap = lastEl.offsetTop + lastEl.offsetHeight / 2 - container.clientHeight / 2;
                                            const jumpTarget = minSnap + progress * (maxSnap - minSnap);
                                            scrollPhysics.current.targetY = jumpTarget;
                                        }
                                    }
                                }}
                            >
                                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#808080] opacity-30" />
                                {projectData.images.filter(img => img.size !== 'empty').map((img, idx, filtered) => {
                                    const posPercent = (idx / (filtered.length - 1)) * 100;
                                    const activeIndex = filtered.findIndex(f => f.id === activeImageId);
                                    const isTriggered = idx < activeIndex;
                                    const isTriggering = idx === activeIndex;
                                    const isEmpty = idx > activeIndex;

                                    return (
                                        <button
                                            key={img.id}
                                            onPointerDown={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                scrollToImage(img.id);
                                            }}
                                            className="absolute left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center group/dot z-[100] cursor-pointer"
                                            style={{ top: `${posPercent}%`, transform: 'translate(-50%, -50%)' }}
                                        >
                                            <div
                                                className={`relative rounded-full transition-all duration-300 flex items-center justify-center ${isTriggering ? 'w-3 h-3' : 'w-2 h-2'}`}
                                                style={{
                                                    backgroundColor: isEmpty ? '#808080' : colorScheme.compString,
                                                    opacity: 1
                                                }}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

            </div>


            {portalTarget && createPortal(
                <div
                    className={`group w-full h-full min-h-0 flex flex-col justify-between rounded-xl border ${theme.border} backdrop-blur-[1vw] bg-transparent py-5 px-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] relative`}
                >
                    {/* Top: Narrative (Flex Grow) */}
                    <div
                        ref={narrativeRef}
                        onScroll={handleNarrativeScroll}
                        className="w-full flex-1 min-h-0 overflow-y-auto custom-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pb-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* NARRATIVE REBUILD v16.8 - Pivot as Subtitle + Conditional Content */}
                        <div className={`w-full ${theme.text} font-light font-content`} style={{ textAlign: 'left', display: 'block' }}>
                            {projectData.description.map((block, idx) => {
                                const isHook = idx === 0;

                                if (block.type === 'text') {
                                    return (
                                        <div
                                            key={idx}
                                            className={`${isHook ? "font-normal mb-8" : "mb-4"}`}
                                            style={{
                                                textAlign: 'left',
                                                display: 'block',
                                                width: '100%',
                                                margin: '0 0 1.5rem 0',
                                                padding: '0',
                                                color: isHook ? colorScheme.base : 'inherit',
                                                fontSize: isHook ? '1.618em' : '12px',
                                                lineHeight: isHook ? '1.3' : '1.6'
                                            }}
                                        >
                                            {Array.isArray(block.content) ? block.content.map((p, pi) => (
                                                <p key={pi} className={pi > 0 ? "mt-4" : ""}>{p}</p>
                                            )) : block.content}
                                        </div>
                                    );
                                }
                                if (block.type === 'pivot-group') {
                                    return (
                                        <div key={idx} className="mb-6 w-full">
                                            {block.items.map((item, i) => {
                                                const isActive = activeImageId === item.targetId;
                                                return (
                                                    <div key={i} className="mb-4">
                                                        {/* Subtitle (The Pivot) */}
                                                        <button
                                                            id={`pivot-btn-${item.targetId}`}
                                                            onClick={() => scrollToImage(item.targetId)}
                                                            className={`block text-left font-bold font-primary transition-all duration-500 uppercase tracking-widest mb-2 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                                            style={{
                                                                color: isActive
                                                                    ? colorScheme.base
                                                                    : (isLightMode ? '#666' : '#999'),
                                                                fontSize: isActive ? '13px' : '11px',
                                                                letterSpacing: '0.15em'
                                                            }}
                                                        >
                                                            {item.pivot}
                                                        </button>

                                                        {/* Content Paragraphs (Conditional) */}
                                                        <div
                                                            className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isActive ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                                                        >
                                                            <div className="text-[13px] leading-relaxed text-left font-content opacity-80 space-y-4">
                                                                {item.paragraphs.map((para, paraIdx) => (
                                                                    <p key={paraIdx}>{para}</p>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>

                    {/* Custom Narrative Scrollbar v16.8 - Fixed 30vh */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 h-[30vh] w-[2px] bg-[#808080] opacity-20 rounded-full overflow-hidden pointer-events-none group-hover:opacity-40 transition-opacity duration-300">
                        <div
                            className={`w-full rounded-full`}
                            style={{
                                height: '20%',
                                top: `${narrativeProgress * (100 - 20)}%`,
                                position: 'absolute',
                                backgroundColor: isLightMode ? '#000' : '#fff',
                                opacity: 0.8
                            }}
                        />
                    </div>


                    {/* Bottom: Meta (Responsive) */}
                    <div className={`w-full h-auto flex flex-col gap-2 flex-shrink-0 pt-6 mt-auto`}>
                        <div className="flex justify-between items-center py-2 h-6">
                            <span className={`text-[10px] uppercase font-primary tracking-widest ${theme.text}`}>Cooperator</span>
                            <a
                                href="https://risingformula.com/team"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-[11px] font-content ${theme.text} relative group`}
                            >
                                {projectData.meta.find(m => m.label === "Cooperator")?.value}
                                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-current opacity-20 group-hover:opacity-100 transition-opacity duration-300`} />
                            </a>
                        </div>
                        <div className="flex justify-between items-center py-2 h-6 border-t border-white/5">
                            <span className={`text-[10px] uppercase font-primary tracking-widest ${theme.text}`}>Type</span>
                            <span className={`text-[11px] font-content ${theme.text}`}>{projectData.meta.find(m => m.label === "Type")?.value}</span>
                        </div>
                    </div>
                </div>,
                portalTarget
            )}
        </div>
    );
}
