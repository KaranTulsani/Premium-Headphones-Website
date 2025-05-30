// GSAP 360-degree Viewer
const viewer = document.getElementById('viewer');
const images = viewer.querySelectorAll('img');
const errorDiv = document.getElementById('viewer-error');
let currentIndex = 0;
let isDragging = false;
let startX = 0;
let rotation = 0;
const totalImages = 12;

// Check if images are loaded
let loadedImages = 0;
images.forEach(img => {
  img.onload = () => {
    loadedImages++;
    if (loadedImages === totalImages) {
      console.log('All images loaded successfully');
    }
  };
  img.onerror = () => {
    console.error(`Failed to load image: ${img.src}`);
    errorDiv.classList.add('show');
  };
});

// Mouse events for dragging
viewer.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  console.log('Dragging started');
  e.preventDefault();
});

viewer.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - startX;
    rotation += deltaX * 0.5; // Adjust sensitivity
    startX = e.clientX;
    updateImage();
  }
});

viewer.addEventListener('mouseup', () => {
  isDragging = false;
  console.log('Dragging stopped');
});

viewer.addEventListener('mouseleave', () => {
  isDragging = false;
});

// Touch events for mobile
viewer.addEventListener('touchstart', (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  console.log('Touch started');
  e.preventDefault();
});

viewer.addEventListener('touchmove', (e) => {
  if (isDragging) {
    const deltaX = e.touches[0].clientX - startX;
    rotation += deltaX * 0.5;
    startX = e.touches[0].clientX;
    updateImage();
  }
});

viewer.addEventListener('touchend', () => {
  isDragging = false;
  console.log('Touch ended');
});

function updateImage() {
  const anglePerImage = 360 / totalImages; // 30 degrees per image
  let index = Math.round(rotation / anglePerImage) % totalImages;
  if (index < 0) index = totalImages + index;
  if (index !== currentIndex) {
    // Fade out current image
    gsap.to(images[currentIndex], { opacity: 0, duration: 0.2 });
    currentIndex = index;
    // Fade in new image
    images.forEach((img, i) => {
      const isActive = i === currentIndex;
      img.classList.toggle('active', isActive);
      if (isActive) {
        gsap.to(img, { opacity: 1, duration: 0.2 });
      }
    });
    console.log(`Switched to image index: ${currentIndex}`);
  }
}

// GSAP Scroll Animations for Features
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('.feature').forEach((feature, index) => {
  const isEven = index % 2 === 0;
  gsap.fromTo(
    feature,
    { opacity: 0, x: isEven ? -100 : 100 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: feature,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      delay: index * 0.2,
    }
  );
});

// GSAP Reviews Toggle Animation
const toggleReviews = document.getElementById('toggleReviews');
const reviews = document.getElementById('reviews');
toggleReviews.addEventListener('click', () => {
  if (reviews.classList.contains('hidden')) {
    reviews.classList.remove('hidden');
    gsap.fromTo(
      reviews,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
    toggleReviews.textContent = 'Hide Reviews';
  } else {
    gsap.to(reviews, {
      height: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => reviews.classList.add('hidden'),
    });
    toggleReviews.textContent = 'Show Reviews';
  }
});

// Carousel Navigation
const carousel = document.querySelector('.carousel');
document.getElementById('prev').addEventListener('click', () => {
  carousel.scrollBy({ left: -200, behavior: 'smooth' });
});
document.getElementById('next').addEventListener('click', () => {
  carousel.scrollBy({ left: 200, behavior: 'smooth' });
});