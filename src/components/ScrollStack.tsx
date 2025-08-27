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
  itemDistance = 200,  // Increased from 100 for more space between cards
  itemScale = 0.02,    // Reduced from 0.03 for subtler scaling
  itemStackDistance = 40,  // Increased from 30 for more spacing when stacked
  stackPosition = "50%",   // Changed from 20% - cards start stacking at middle of viewport
  scaleEndPosition = "30%", // Changed from 10% - more time to see the card
  baseScale = 0.9,         // Increased from 0.85 for less dramatic scaling
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
    cardHeights: number[];
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
    const cardHeight = cached.cardHeights[index];
    
    // Card is fully visible when its bottom edge reaches the stack position
    const cardBottom = cardTop + cardHeight;
    const viewportTop = scrollTop;
    const viewportBottom = scrollTop + cached.containerHeight;
    
    // Trigger points adjusted for better visibility
    const triggerStart = cardTop - cached.stackPositionPx - (itemStackDistance * index);
    const triggerEnd = cardTop - cached.scaleEndPositionPx;
    
    // Pin points - when card should stick
    const pinStart = triggerStart;
    const pinEnd = cached.endElementTop - cached.containerHeight / 2;

    // Don't animate cards that are too far from viewport
    if (cardTop > viewportBottom + 500 || cardBottom < viewportTop - 500) {
      return;
    }

    // Calculate progress with smoother interpolation
    let scaleProgress = 0;
    if (scrollTop >= triggerStart && scrollTop <= triggerEnd) {
      scaleProgress = (scrollTop - triggerStart) / (triggerEnd - triggerStart);
      // Ease the progress for smoother animation
      scaleProgress = Math.pow(scaleProgress, 1.5); // Easing curve
    } else if (scrollTop > triggerEnd) {
      scaleProgress = 1;
    }

    // Calculate scale with less dramatic changes
    const targetScale = baseScale + (index * itemScale);
    const scale = 1 - scaleProgress * (1 - targetScale);
    
    // Rotation (optional)
    const rotation = rotationAmount ? index * rotationAmount * scaleProgress : 0;

    // Calculate blur for depth effect
    let blur = 0;
    if (blurAmount && index > 0) {
      // Find which card is currently on top
      let topCardIndex = 0;
      for (let j = 0; j < cardsRef.current.length; j++) {
        const jTriggerStart = cached.cardTops[j] - cached.stackPositionPx - (itemStackDistance * j);
        if (scrollTop >= jTriggerStart) {
          topCardIndex = j;
        }
      }
      // Only blur cards behind the top card
      if (index < topCardIndex) {
        blur = Math.min((topCardIndex - index) * blurAmount, blurAmount * 3);
      }
    }

    // Calculate translateY for pinning effect
    let translateY = 0;
    if (scrollTop >= pinStart && scrollTop <= pinEnd) {
      // Pin the card
      translateY = scrollTop - cardTop + cached.stackPositionPx + (itemStackDistance * index);
    } else if (scrollTop > pinEnd) {
      // Keep pinned at end position
      translateY = pinEnd - cardTop + cached.stackPositionPx + (itemStackDistance * index);
    }

    // Apply transforms using will-change for better performance
    card.style.willChange = 'transform, filter';
    card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
    card.style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
    
    // Add opacity for cards that are stacked
    if (scaleProgress > 0.8 && index > 0) {
      card.style.opacity = '0.95';
    } else {
      card.style.opacity = '1';
    }

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
        lastScrollTopRef.current = scrollTop;

        // Update all cards
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

  // Setup cache with card dimensions
  const setupCache = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const containerHeight = scroller.clientHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElement = scroller.querySelector('.scroll-stack-end') as HTMLElement;
    const endElementTop = endElement ? endElement.offsetTop : 0;
    
    const cardTops = cardsRef.current.map(card => card.offsetTop);
    const cardHeights = cardsRef.current.map(card => card.offsetHeight);

    cachedDataRef.current = {
      containerHeight,
      stackPositionPx,
      scaleEndPositionPx,
      endElementTop,
      cardTops,
      cardHeights
    };
  }, [stackPosition, scaleEndPosition, parsePercentage]);

  // Optimized Lenis setup with better settings
  const setupLenis = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
      duration: 1.2,  // Slightly longer for smoother scrolling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      gestureOrientation: 'vertical',
      wheelMultiplier: 0.8,  // Slower wheel scrolling for better control
      lerp: 0.1,  // Smoother lerping
      syncTouch: true,
      syncTouchLerp: 0.08,
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

    // Setup initial CSS
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      
      // Set initial styles for better performance
      card.style.willChange = 'transform, filter, opacity';
      card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.opacity = '1';
      card.style.transition = `filter ${scaleDuration}s cubic-bezier(0.4, 0, 0.2, 1), opacity ${scaleDuration}s ease`;
    });

    // Setup cache and Lenis
    setupCache();
    setupLenis();
    
    // Initial update
    requestUpdate();

    // Handle resize with debounce
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupCache();
        requestUpdate();
      }, 250);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
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