import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that scrolls to the top of the page whenever the route changes
 */
export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Also scroll any phone content containers to top
    const phoneContent = document.querySelector('.phone-content');
    if (phoneContent) {
      phoneContent.scrollTo(0, 0);
    }

    // Handle any other scroll containers that might exist
    const scrollContainers = document.querySelectorAll('[data-scroll-container]');
    scrollContainers.forEach(container => {
      container.scrollTo(0, 0);
    });

    // Use a small timeout to ensure the scroll happens after any layout changes
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      if (phoneContent) {
        phoneContent.scrollTo(0, 0);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null; // This component doesn't render anything
}
