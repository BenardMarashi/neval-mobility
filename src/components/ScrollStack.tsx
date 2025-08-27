import React, { ReactNode, useLayoutEffect, useRef, useCallback } from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = React.memo(({
  children,
  itemClassName = "",
}) => (
  <div
    className={`scroll-stack-card ${itemClassName}`.trim()}
    data-scroll-item
  >
    {children}
  </div>
));

ScrollStackItem.displayName = 'ScrollStackItem';

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastScrollTopRef = useRef(0);
  const ticking = useRef(false);
  const cachedDataRef = useRef<{
    containerHeight: number;
    stackPositionPx: number;
    scaleEndPositionPx: number;
    endElementTop: number;
    cardTops: number[];
  } | null>(null);

  // Parse percentage helper with memoization
  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  // Optimized transform update for individual card
  const updateCardTransform = useCallback((
    card: HTMLElement, 
    index: number, 
    scrollTop: number,
    cached: typeof cachedDataRef.current
  ) => {
    if (!cached) return;

    const cardTop = cached.cardTops[index];
    const triggerStart = cardTop - cached.stackPositionPx - (itemStackDistance * index);
    const triggerEnd = cardTop - cached.scaleEndPositionPx;
    const pinStart = triggerStart;
    const pinEnd = cached.endElementTop - cached.containerHeight / 2;

    // Early exit if card is far from viewport
    const viewportBottom = scrollTop + cached.containerHeight;
    if (cardTop > viewportBottom + 500 || cardTop < scrollTop - 1000) {
      return;
    }

    // Calculate progress
    const scaleProgress = Math.max(0, Math.min(1, 
      scrollTop < triggerStart ? 0 : 
      scrollTop > triggerEnd ? 1 : 
      (scrollTop - triggerStart) / (triggerEnd - triggerStart)
    ));

    const targetScale = baseScale + (index * itemScale);
    const scale = 1 - scaleProgress * (1 - targetScale);
    const rotation = rotationAmount ? index * rotationAmount * scaleProgress : 0;

    // Calculate blur
    let blur = 0;
    if (blurAmount && index > 0) {
      let topCardIndex = 0;
      for (let j = 0; j < cardsRef.current.length; j++) {
        const jTriggerStart = cached.cardTops[j] - cached.stackPositionPx - (itemStackDistance * j);
        if (scrollTop >= jTriggerStart) {
          topCardIndex = j;
        }
      }
      if (index < topCardIndex) {
        blur = Math.max(0, (topCardIndex - index) * blurAmount);
      }
    }

    // Calculate translateY
    let translateY = 0;
    if (scrollTop >= pinStart && scrollTop <= pinEnd) {
      translateY = scrollTop - cardTop + cached.stackPositionPx + (itemStackDistance * index);
    } else if (scrollTop > pinEnd) {
      translateY = pinEnd - cardTop + cached.stackPositionPx + (itemStackDistance * index);
    }

    // Apply transforms using CSS custom properties for better performance
    card.style.setProperty('--scale', scale.toFixed(3));
    card.style.setProperty('--translateY', `${translateY.toFixed(1)}px`);
    card.style.setProperty('--rotation', `${rotation.toFixed(1)}deg`);
    card.style.setProperty('--blur', blur > 0 ? `${blur.toFixed(1)}px` : '0');

    // Check if last card is in view for callback
    if (index === cardsRef.current.length - 1) {
      const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (isInView && !stackCompletedRef.current) {
        stackCompletedRef.current = true;
        onStackComplete?.();
      } else if (!isInView && stackCompletedRef.current) {
        stackCompletedRef.current = false;
      }
    }
  }, [itemScale, itemStackDistance, baseScale, rotationAmount, blurAmount, onStackComplete]);

  // Main update function with requestAnimationFrame throttling
  const requestUpdate = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const scroller = scrollerRef.current;
        if (!scroller || !cachedDataRef.current) {
          ticking.current = false;
          return;
        }

        const scrollTop = scroller.scrollTop;
        const scrollDelta = Math.abs(scrollTop - lastScrollTopRef.current);
        
        // Skip minor scroll updates
        if (scrollDelta < 0.5) {
          ticking.current = false;
          return;
        }

        lastScrollTopRef.current = scrollTop;

        // Update only visible cards
        cardsRef.current.forEach((card, index) => {
          if (card) {
            updateCardTransform(card, index, scrollTop, cachedDataRef.current);
          }
        });

        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [updateCardTransform]);

  // Setup cache
  const setupCache = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const containerHeight = scroller.clientHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElement = scroller.querySelector('.scroll-stack-end') as HTMLElement;
    const endElementTop = endElement ? endElement.offsetTop : 0;
    const cardTops = cardsRef.current.map(card => card.offsetTop);

    cachedDataRef.current = {
      containerHeight,
      stackPositionPx,
      scaleEndPositionPx,
      endElementTop,
      cardTops
    };
  }, [stackPosition, scaleEndPosition, parsePercentage]);

  // Optimized Lenis setup
  const setupLenis = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      gestureOrientation: 'vertical',
      wheelMultiplier: 1,
      lerp: 0.12,
      syncTouch: true,
      syncTouchLerp: 0.1,
    });

    lenis.on('scroll', requestUpdate);

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);

    lenisRef.current = lenis;
    return lenis;
  }, [requestUpdate]);

  // Main setup effect
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Get cards and setup initial styles
    const cards = Array.from(scroller.querySelectorAll("[data-scroll-item]")) as HTMLElement[];
    cardsRef.current = cards;

    // Setup initial CSS with CSS variables
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      
      // Set initial CSS custom properties
      card.style.cssText = `
        margin-bottom: ${i < cards.length - 1 ? itemDistance : 0}px;
        will-change: transform;
        transform-origin: top center;
        backface-visibility: hidden;
        transform: translateZ(0) translateY(var(--translateY, 0)) scale(var(--scale, 1)) rotate(var(--rotation, 0deg));
        filter: blur(var(--blur, 0));
        transition: filter ${scaleDuration}s cubic-bezier(0.4, 0, 0.2, 1);
      `;
      
      card.style.setProperty('--scale', '1');
      card.style.setProperty('--translateY', '0px');
      card.style.setProperty('--rotation', '0deg');
      card.style.setProperty('--blur', '0');
    });

    // Setup cache and Lenis
    setupCache();
    setupLenis();
    
    // Initial update
    requestUpdate();

    // Handle resize
    const handleResize = () => {
      setupCache();
      requestUpdate();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      cachedDataRef.current = null;
      lastScrollTopRef.current = 0;
      ticking.current = false;
    };
  }, [
    itemDistance,
    scaleDuration,
    setupCache,
    setupLenis,
    requestUpdate,
  ]);

  return (
    <div
      className={`scroll-stack-scroller ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

ScrollStack.displayName = 'ScrollStack';

export default React.memo(ScrollStack);