/**
 * Main JavaScript - CV Retno Jala Arta Website
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollAnimations();
  initSmoothScroll();
});

/**
 * Navigation - Sticky Header & Mobile Menu
 */
function initNavigation() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!header) return;

  // Sticky header on scroll
  let lastScroll = 0;
  const scrollThreshold = 100;

  function handleScroll() {
    const currentScroll = window.pageYOffset;

    // Add scrolled class when past threshold
    if (currentScroll > scrollThreshold) {
      header.classList.add('header--scrolled');
      header.classList.remove('header--transparent');
    } else {
      header.classList.remove('header--scrolled');
      // Only add transparent class on homepage hero
      if (document.querySelector('.hero')) {
        header.classList.add('header--transparent');
      }
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // Mobile menu toggle
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function() {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active');
      document.body.classList.toggle('nav-open', isOpen);

      if (navOverlay) {
        navOverlay.classList.toggle('is-visible', isOpen);
      }
    });

    // Close menu when clicking overlay
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a link
    navLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  function closeMenu() {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    document.body.classList.remove('nav-open');
    if (navOverlay) {
      navOverlay.classList.remove('is-visible');
    }
  }
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  if (!animatedElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Handle stagger children
        if (entry.target.classList.contains('stagger-children')) {
          entry.target.classList.add('is-visible');
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(function(el) {
    observer.observe(el);
  });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Gallery Lightbox
 */
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');

  if (!galleryItems.length || !lightbox) return;

  const lightboxImage = lightbox.querySelector('.lightbox__image');
  const lightboxCaption = lightbox.querySelector('.lightbox__caption');
  const lightboxClose = lightbox.querySelector('.lightbox__close');
  const lightboxPrev = lightbox.querySelector('.lightbox__prev');
  const lightboxNext = lightbox.querySelector('.lightbox__next');
  const lightboxCounter = lightbox.querySelector('.lightbox__counter');

  let currentIndex = 0;
  const images = Array.from(galleryItems).map(function(item) {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-item__caption');
    return {
      src: img ? img.src : '',
      alt: img ? img.alt : '',
      caption: caption ? caption.textContent : ''
    };
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const image = images[currentIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    if (lightboxCaption) {
      lightboxCaption.textContent = image.caption || image.alt;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  }

  // Event listeners
  galleryItems.forEach(function(item, index) {
    item.addEventListener('click', function() {
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', nextImage);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', prevImage);
  }

  // Close on backdrop click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('is-active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
}

/**
 * Contact Form - WhatsApp Integration
 */
function initContactForm() {
  const form = document.getElementById('contact-form');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const nama = formData.get('nama') || '';
    const perusahaan = formData.get('perusahaan') || '-';
    const jumlahPax = formData.get('jumlah_pax') || '';
    const layanan = formData.get('layanan') || '';
    const tanggal = formData.get('tanggal') || '-';
    const whatsapp = formData.get('whatsapp') || '';
    const pesan = formData.get('pesan') || '-';

    // Get layanan text from select
    const layananSelect = form.querySelector('#layanan');
    const layananText = layananSelect ? layananSelect.options[layananSelect.selectedIndex].text : layanan;

    // Format message
    const message = `*Permintaan Penawaran Catering*
━━━━━━━━━━━━━━━━━━━━
*Nama:* ${nama}
*Perusahaan:* ${perusahaan}
*Jumlah Pax:* ${jumlahPax}
*Layanan:* ${layananText}
*Tanggal:* ${tanggal}
*No. WhatsApp:* ${whatsapp}
━━━━━━━━━━━━━━━━━━━━
*Pesan:*
${pesan}

_Dikirim dari website CV Retno Jala Arta_`;

    // WhatsApp number (replace with actual number)
    const phoneNumber = '6281234567890';
    const whatsappUrl = 'https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(message);

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  });
}

/**
 * Gallery Filter (optional)
 */
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.gallery-filter__btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterButtons.length || !galleryItems.length) return;

  filterButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;

      // Update active button
      filterButtons.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');

      // Filter items
      galleryItems.forEach(function(item) {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Initialize page-specific features
document.addEventListener('DOMContentLoaded', function() {
  // Gallery page
  if (document.querySelector('.gallery-grid')) {
    initGallery();
    initGalleryFilter();
  }

  // Contact page
  if (document.getElementById('contact-form')) {
    initContactForm();
  }
});
