'use strict';

// Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


// Modal window

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// End modal window
//////////////////////////////////////////


// Smooth scrolling

btnScrollTo.addEventListener('click', function(e) {
    //const s1coords = section1.getBoundingClientRect();

    // Scrolling (oldschool)
/*     window.scrollTo({
        left: s1coords.left + window.pageXOffset,
        top: s1coords.top + window.pageYOffset,
        behavior: 'smooth',
    }); */

    // New modern way (modern browser only)
    section1.scrollIntoView({behavior: 'smooth'});

});

// End smooth scrolling
//////////////////////////////////////////


// Page navigation (standard (not useful when 1000s of elements))

/* document.querySelectorAll('.nav__link').forEach(function(el) {
    el.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('href');
        document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    });
}); */

// (EVENT DELEGATION)
// 1. add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e) {
    e.preventDefault();

    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    }
});

// End page navigation
//////////////////////////////////////////


// Tabbed component
// Event listener function
tabsContainer.addEventListener('click', function(e) {
    const clicked = e.target.closest('.operations__tab');

    // Guard clause
    if (!clicked) return;

    // Remove active classes
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));
    
    // Activate tab
    clicked.classList.add('operations__tab--active');

    // Activate content area
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

});


// Menu fade animation
const handleHover = function(e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
        });

        logo.style.opacity = this;
    }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


// Sticky navigation - IntersectionObserver API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver
(stickyNav, {
    root: null,
    treshold: 0,
    rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);


// Reveal sections animation
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver
(revealSection, {
    root: null,
    threshold: 0.15
});

allSections.forEach(function(section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});


// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
    const [entry] = entries;
    
    if (!entry.isIntersecting) return;

    // Replace src with the data-source
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function() {
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver
(loadImg, {
    root: null,
    treshold: 0,
    rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));


// Slider component
const slider = function() {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');
    let curSlide = 0;
    const maxSlide = slides.length;
    const slider = document.querySelector('.slider');
    
    // Creating the dots under the slider
    const createDots = function() {
        slides.forEach(function(_, i) {
            dotContainer.insertAdjacentHTML('beforeend',
            `<button class="dots__dot" data-slide="${i}"></button>`);
        });
    };
    
    const activateDot = function(slide) {
        document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    }
    
    // Go to slide function
    const goToSlide = function(slide) {
        slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
    }
    
    // Going to the next slide
    const nextSlide = function() {
        if (curSlide === maxSlide) {
            curSlide = 0;
        } else {
            curSlide++;
        }
    
        goToSlide(curSlide);
        activateDot(curSlide);
    }
    
    // Going to the previous slide
    const prevSlide = function() {
        if (curSlide === 0) {
            curSlide = maxSlide -1;
        } else {
            curSlide--;
        }
    
        goToSlide(curSlide);
        activateDot(curSlide);
    }
    
    const init = function() {
        goToSlide(0);
        createDots();
        activateDot(0);
    }

    init();
    
    // Event handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
    
    // Navigating slides on key press (left and right keyboard arrow)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Navigating the slides with the dots
    dotContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('dots__dot')) {
            const {slide} = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });
}

slider();