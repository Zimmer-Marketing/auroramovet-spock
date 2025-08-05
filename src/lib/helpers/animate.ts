import type { Action } from 'svelte/action';
import { browser } from '$app/environment';

interface AnimationConfig {
    y?: number;
    x?: number;
    duration?: number;
    delay?: number;
    threshold?: number;
    rootMargin?: string;
}

// Define the breakpoint (Tailwind's md breakpoint)
const MD_BREAKPOINT = '(min-width: 768px)';

export const animate: Action<HTMLElement, AnimationConfig> = (node, config = {}) => {
    if (!browser) return; // Action doesn't run on server

    const {
        y = 0,
        x = 0,
        duration = 1200,
        delay = 0,
        threshold = 0.2,
        rootMargin = '0px'
    } = config;

    let visible = false;
    let observer: IntersectionObserver;
    let mediaQuery = window.matchMedia(MD_BREAKPOINT);

    const getEffectiveX = () => (mediaQuery.matches ? x : 0);

    // Set initial state
    const setInitialState = () => {
        const effectiveX = getEffectiveX();
        node.style.visibility = 'hidden';
        node.style.opacity = '0';
        node.style.transform = `translate(${effectiveX}px, ${y}px)`;
        node.style.transition = 'none';
    }

    setInitialState(); // Set on initialization

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        visible = entries[0].isIntersecting;
        const effectiveX = getEffectiveX();

        if (visible) {
            node.style.visibility = 'visible';
            
            // Force a reflow
            node.offsetHeight;
            
            requestAnimationFrame(() => {
                node.style.transition = `transform ${duration}ms ease-out ${delay}ms, opacity ${duration}ms ease-out ${delay}ms`;
                node.style.opacity = '1';
                node.style.transform = 'translate(0, 0)'; // Animate to final position (0,0)
            });
        } else {
            node.style.visibility = 'hidden';
            node.style.opacity = '0';
            node.style.transform = `translate(${effectiveX}px, ${y}px)`; // Reset to initial state based on screen size
            node.style.transition = 'none';
        }
    };

    // Handle screen size changes
    const handleResize = () => {
        setInitialState(); // Reset state based on new screen size if not visible
        // Re-evaluate intersection if needed, though observer usually handles this
    }

    mediaQuery.addEventListener('change', handleResize);

    observer = new IntersectionObserver(handleIntersection, {
        threshold,
        rootMargin
    });

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
            mediaQuery.removeEventListener('change', handleResize);
        },
        update(newConfig: AnimationConfig) {
            // Logic to handle updates to config parameters (y, x, duration, etc.)
            // This part might need refinement if you expect these props to change dynamically often
            // For simplicity, we'll just re-run the setup logic if major props change.
            const {
                y: newY = y,
                x: newX = x, // We still need the original configured x for desktop
                duration: newDuration = duration,
                delay: newDelay = delay,
                threshold: newThreshold = threshold,
                rootMargin: newRootMargin = rootMargin
            } = newConfig;

            if (newY !== y || newX !== x || newDuration !== duration || newDelay !== delay || 
                newThreshold !== threshold || newRootMargin !== rootMargin) {
                
                // Update config locally (important for getEffectiveX if x changes)
                Object.assign(config, newConfig);
                
                setInitialState(); // Reset initial state with new config
                
                observer.disconnect();
                observer = new IntersectionObserver(handleIntersection, {
                    threshold: newThreshold,
                    rootMargin: newRootMargin
                });
                observer.observe(node);
            }
        }
    };
}; 