/**
 * useSmoothScroll Hook
 * Custom React hook for smooth scrolling navigation
 */

const { useEffect } = React;

function useSmoothScroll() {
  useEffect(() => {
    const handleClick = (event) => {
      const link = event.target.closest('.nav-link[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
}

