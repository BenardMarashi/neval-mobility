// src/types/lenis.d.ts
// Type definitions for Lenis smooth scroll library

declare module 'lenis' {
  export interface LenisOptions {
    wrapper?: HTMLElement | Window;
    content?: HTMLElement;
    duration?: number;
    easing?: (t: number) => number;
    direction?: 'vertical' | 'horizontal';
    gestureOrientation?: 'vertical' | 'horizontal' | 'both';
    smooth?: boolean;
    smoothWheel?: boolean;
    smoothTouch?: boolean;
    touchMultiplier?: number;
    wheelMultiplier?: number;
    normalizeWheel?: boolean;
    infinite?: boolean;
    lerp?: number;
    syncTouch?: boolean;
    syncTouchLerp?: number;
    touchInertiaMultiplier?: number;
    autoResize?: boolean;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    
    // Methods
    destroy(): void;
    on(event: string, callback: (e: any) => void): void;
    off(event: string, callback: (e: any) => void): void;
    emit(event: string, ...args: any[]): void;
    raf(time: number): void;
    scrollTo(
      target: number | string | HTMLElement,
      options?: {
        offset?: number;
        immediate?: boolean;
        duration?: number;
        easing?: (t: number) => number;
        lock?: boolean;
        force?: boolean;
        onComplete?: () => void;
      }
    ): void;
    start(): void;
    stop(): void;
    resize(): void;
    
    // Properties
    direction: 1 | -1;
    velocity: number;
    animate: {
      value: number;
      target: number;
      to: (value: number) => void;
      stop: () => void;
    };
    isLocked: boolean;
    isStopped: boolean;
    isSmooth: boolean;
    isScrolling: boolean;
    limit: number;
    progress: number;
    scroll: number;
    targetScroll: number;
  }
}