// Select all elements that need animation
const animatedCards = document.querySelectorAll(".animate");

// Create observer for scroll animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.2
  }
);

// Attach observer to each card
animatedCards.forEach(card => observer.observe(card));
