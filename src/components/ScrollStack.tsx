import React, { ReactNode, useEffect, useRef, useState } from "react";
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
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const cards = container.querySelectorAll('.scroll-stack-card');
      let currentActive = 0;
      
      cards.forEach((card, index) => {
        const element = card as HTMLElement;
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate position relative to container
        const cardTop = rect.top - containerRect.top;
        const stickPoint = 100;
        
        // Check if this card has reached the stick point
        if (cardTop <= stickPoint + 10) {
          currentActive = index;
        }
        
        // Apply transforms based on whether card is active, previous, or upcoming
        if (index <= currentActive) {
          // This is the current card or a previous card
          const stackPosition = currentActive - index;
          const scale = 1 - (stackPosition * 0.005);
          const translateY = stackPosition * 30;
          const translateX = stackPosition * 5;
          const brightness = 1 - (stackPosition * 0.15);
          
          // Set z-index dynamically - current card on top
          element.style.zIndex = `${100 - stackPosition}`;
          element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
          element.style.filter = `brightness(${brightness})`;
          element.style.opacity = '1';
          element.style.pointerEvents = stackPosition === 0 ? 'auto' : 'none';
        } else {
          // Upcoming cards - keep them normal
          element.style.zIndex = `${50 - index}`;
          element.style.transform = 'translate(0, 0) scale(1)';
          element.style.filter = 'brightness(1)';
          element.style.opacity = '1';
          element.style.pointerEvents = 'auto';
        }
      });
      
      setActiveIndex(currentActive);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial positioning

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`scroll-stack-container ${className}`.trim()}
      ref={containerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-spacer" />
      </div>
    </div>
  );
};

ScrollStack.displayName = 'ScrollStack';

export default React.memo(ScrollStack);