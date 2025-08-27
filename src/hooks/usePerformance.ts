// src/hooks/usePerformance.ts
// THIS IS A .ts FILE - NO JSX ALLOWED!

import { useEffect, useState, useRef, createElement } from 'react';

interface PerformanceMetrics {
  fps: number;
  scrollFps: number;
  memoryUsage?: number;
  renderTime: number;
}

// Extend the Performance interface to include memory
interface PerformanceMemory {
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

export const usePerformance = (enabled: boolean = false): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    scrollFps: 60,
    renderTime: 0,
  });

  const frameCount = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());
  const scrollFrameCount = useRef<number>(0);
  const lastScrollTime = useRef<number>(performance.now());
  const rafId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    const measureFPS = (): void => {
      const currentTime = performance.now();
      frameCount.current++;

      // Measure general FPS
      if (currentTime >= lastTime.current + 1000) {
        const fps = Math.round(
          (frameCount.current * 1000) / (currentTime - lastTime.current)
        );
        
        // Check memory if available (Chrome only)
        let memoryUsage: number | undefined;
        try {
          const extendedPerf = performance as ExtendedPerformance;
          if (extendedPerf.memory) {
            memoryUsage = Math.round(
              (extendedPerf.memory.usedJSHeapSize / extendedPerf.memory.jsHeapSizeLimit) * 100
            );
          }
        } catch (error) {
          // Memory API not available
        }

        setMetrics((prev) => ({
          ...prev,
          fps,
          memoryUsage,
          renderTime: currentTime - lastTime.current,
        }));

        frameCount.current = 0;
        lastTime.current = currentTime;

        // Auto-enable performance mode if needed
        if (fps < 30 && document.body) {
          document.body.classList.add('performance-mode');
          console.warn(`Low FPS detected: ${fps}fps. Enabling performance mode.`);
        } else if (fps > 50 && document.body) {
          document.body.classList.remove('performance-mode');
        }
      }

      rafId.current = requestAnimationFrame(measureFPS);
    };

    // Track scroll performance
    const handleScroll = (): void => {
      const currentTime = performance.now();
      scrollFrameCount.current++;

      if (currentTime >= lastScrollTime.current + 1000) {
        const scrollFps = Math.round(
          (scrollFrameCount.current * 1000) / (currentTime - lastScrollTime.current)
        );
        
        setMetrics((prev) => ({
          ...prev,
          scrollFps,
        }));

        scrollFrameCount.current = 0;
        lastScrollTime.current = currentTime;
      }
    };

    rafId.current = requestAnimationFrame(measureFPS);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafId.current !== undefined) {
        cancelAnimationFrame(rafId.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled]);

  return metrics;
};

// Performance debugging component props
interface PerformanceDebuggerProps {
  show?: boolean;
}

// Performance debugging component - NO JSX, only React.createElement!
export const PerformanceDebugger = ({ 
  show = false 
}: PerformanceDebuggerProps): any => {
  const metrics = usePerformance(show);

  if (!show) {
    return null;
  }

  const getColorForFPS = (fps: number): string => {
    if (fps >= 55) return '#0f0';
    if (fps >= 30) return '#ff0';
    return '#f00';
  };

  // Build the children array for the main div
  const children = [
    createElement('div', { 
      key: 'fps',
      style: { color: getColorForFPS(metrics.fps) } 
    }, `FPS: ${metrics.fps}`),
    
    createElement('div', { 
      key: 'scroll',
      style: { color: getColorForFPS(metrics.scrollFps) } 
    }, `Scroll: ${metrics.scrollFps}`),
  ];

  // Add memory if available
  if (metrics.memoryUsage !== undefined) {
    children.push(
      createElement('div', { 
        key: 'memory',
        style: { color: metrics.memoryUsage > 80 ? '#f00' : '#0f0' } 
      }, `Memory: ${metrics.memoryUsage}%`)
    );
  }

  // Add render time
  children.push(
    createElement('div', { 
      key: 'frame',
      style: { color: metrics.renderTime > 16.67 ? '#ff0' : '#0f0' } 
    }, `Frame: ${metrics.renderTime.toFixed(1)}ms`)
  );

  // Return the main container with all children
  return createElement(
    'div',
    {
      style: {
        position: 'fixed' as any,
        top: 80,
        right: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        color: getColorForFPS(metrics.fps),
        padding: '10px',
        fontSize: '12px',
        fontFamily: 'monospace',
        borderRadius: '4px',
        zIndex: 9999,
        pointerEvents: 'none' as any,
        minWidth: '120px',
      }
    },
    ...children
  );
};

// Export a hook for performance monitoring without UI
export const usePerformanceMonitor = () => {
  const [isLowPerformance, setIsLowPerformance] = useState<boolean>(false);
  const metrics = usePerformance(true);

  useEffect(() => {
    setIsLowPerformance(metrics.fps < 30);
  }, [metrics.fps]);

  return {
    metrics,
    isLowPerformance,
  };
};