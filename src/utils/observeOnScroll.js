export function observeOnScroll(selector, className = 'visible', threshold = 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(className);
      }
    });
  }, { threshold });

  document.querySelectorAll(selector).forEach(el => {
    observer.observe(el);
  });
}