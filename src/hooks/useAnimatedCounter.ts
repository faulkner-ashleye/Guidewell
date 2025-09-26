import { useState, useEffect } from 'react';

/**
 * Hook for animating number counters with smooth easing
 * @param target - The target number to count to
 * @param duration - Animation duration in milliseconds (default: 2000)
 * @param startValue - Starting value (default: 0)
 * @returns The current animated count value
 */
export function useAnimatedCounter(
  target: number, 
  duration: number = 2000, 
  startValue: number = 0
): number {
  const [count, setCount] = useState(startValue);
  
  useEffect(() => {
    let startTime: number;
    const difference = target - startValue;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease-out cubic function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (difference * easeOut);
      
      setCount(Math.floor(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration, startValue]);
  
  return count;
}

/**
 * Hook for animating currency values with proper formatting
 * @param target - The target currency amount
 * @param duration - Animation duration in milliseconds (default: 1500)
 * @param startValue - Starting value (default: 0)
 * @returns Formatted currency string
 */
export function useAnimatedCurrency(
  target: number, 
  duration: number = 1500, 
  startValue: number = 0
): string {
  const count = useAnimatedCounter(target, duration, startValue);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(count);
}

/**
 * Hook for animating percentage values
 * @param target - The target percentage (0-100)
 * @param duration - Animation duration in milliseconds (default: 1200)
 * @param startValue - Starting value (default: 0)
 * @returns Formatted percentage string
 */
export function useAnimatedPercentage(
  target: number, 
  duration: number = 1200, 
  startValue: number = 0
): string {
  const count = useAnimatedCounter(target, duration, startValue);
  
  return `${count}%`;
}

/**
 * Hook for progressive reveal of items with staggered timing
 * @param items - Array of items to reveal progressively
 * @param delay - Delay between each item reveal in milliseconds (default: 100)
 * @returns Array of currently visible items
 */
export function useProgressiveReveal<T>(
  items: T[], 
  delay: number = 100
): T[] {
  const [visibleItems, setVisibleItems] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleItems(prev => Math.min(prev + 1, items.length));
    }, delay);
    
    return () => clearInterval(timer);
  }, [items.length, delay]);
  
  return items.slice(0, visibleItems);
}


