// src/utils/performanceUtils.ts

/**
 * Performance monitoring utilities for ScrollStack
 */

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private callback?: (fps: number) => void;
  private rafId?: number;

  constructor(callback?: (fps: number) => void) {
    this.callback = callback;
  }

  start() {
    this.measure();
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  private measure = () => {
    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      if (this.callback) {
        this.callback(this.fps);
      }

      // Auto-adjust quality if FPS drops
      if (this.fps < 30) {
        document.body.classList.add('performance-mode');
      } else if (this.fps > 50) {
        document.body.classList.remove('performance-mode');
      }
    }

    this.rafId = requestAnimationFrame(this.measure);
  };

  getFPS() {
    return this.fps;
  }
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle = false;
  let lastResult: any;
  
  return ((...args: any[]) => {
    if (!inThrottle) {
      lastResult = func.apply(null, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  }) as T;
}

/**
 * Debounce function for resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement, offset = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight + offset &&
    rect.bottom > -offset
  );
}

/**
 * Optimize transform string generation
 */
export function buildTransform(
  x: number = 0,
  y: number = 0,
  scale: number = 1,
  rotate: number = 0
): string {
  const transforms = [];
  
  if (x !== 0 || y !== 0) {
    transforms.push(`translate3d(${x}px, ${y}px, 0)`);
  }
  if (scale !== 1) {
    transforms.push(`scale(${scale})`);
  }
  if (rotate !== 0) {
    transforms.push(`rotate(${rotate}deg)`);
  }
  
  return transforms.length > 0 ? transforms.join(' ') : 'none';
}

/**
 * Batch DOM updates
 */
export class DOMBatcher {
  private reads: (() => void)[] = [];
  private writes: (() => void)[] = [];
  private scheduled = false;

  read(fn: () => void) {
    this.reads.push(fn);
    this.scheduleFlush();
  }

  write(fn: () => void) {
    this.writes.push(fn);
    this.scheduleFlush();
  }

  private scheduleFlush() {
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  private flush() {
    const reads = this.reads.slice();
    const writes = this.writes.slice();
    
    this.reads = [];
    this.writes = [];
    this.scheduled = false;

    reads.forEach(fn => fn());
    writes.forEach(fn => fn());
  }
}

/**
 * Smooth scroll with easing
 */
export function smoothScrollTo(
  element: HTMLElement,
  target: number,
  duration: number = 1000
) {
  const start = element.scrollTop;
  const distance = target - start;
  const startTime = performance.now();

  const easeInOutCubic = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const scroll = () => {
    const currentTime = performance.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    
    element.scrollTop = start + distance * ease;

    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  };

  requestAnimationFrame(scroll);
}