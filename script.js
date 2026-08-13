document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Elevate on Scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.mobile-item, .btn-mobile-cta').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 3. Metric Counter Animation (Com Incremento Dinâmico até 98%, 100% e 1000+)
    const metricNumbers = document.querySelectorAll('.metric-number');
    let animated = false;

    const animateCounters = () => {
        metricNumbers.forEach(counter => {
            const targetAttr = counter.getAttribute('data-target');
            if (!targetAttr) return;
            const target = parseInt(targetAttr, 10);
            if (isNaN(target)) return;

            const initialText = counter.innerText || '';
            const suffix = initialText.includes('%') ? '%' : (initialText.includes('+') ? '+' : '');
            let count = 0;
            const steps = 45;
            const increment = target / steps;

            const updateCount = () => {
                count += increment;
                if (count < target) {
                    counter.innerText = Math.ceil(count) + suffix;
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer para disparar a animação quando a barra entra na tela
    const metricsSection = document.querySelector('.metrics-bar');
    if (metricsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        }, { threshold: 0.15 });
        observer.observe(metricsSection);
    }

    // 4. FAQ Accordion Interactivity
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all open accordion items
            faqItems.forEach(i => {
                i.classList.remove('active');
                const btn = i.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            // If clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 5. INFINITE CAROUSEL SLIDER (2 per view on Desktop, 1 per view on Mobile)
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    const slides = Array.from(track ? track.children : []);

    if (track && slides.length > 0) {
        let currentIndex = 0;
        let autoPlayTimer = null;

        const getSlidesPerView = () => (window.innerWidth <= 768 ? 1 : 2);

        const getMaxIndex = () => {
            const perView = getSlidesPerView();
            return Math.max(0, slides.length - perView);
        };

        const updateCarousel = () => {
            const perView = getSlidesPerView();
            const slideWidthPercent = 100 / perView;
            // 24px gap offset calculation
            const gapOffsetPx = (24 * (currentIndex / perView));
            
            // Apply CSS transform
            const moveAmount = (currentIndex * slideWidthPercent);
            track.style.transform = `translateX(calc(-${moveAmount}% - ${gapOffsetPx}px))`;

            // Update dots
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, idx) => {
                    if (idx === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        };

        const nextSlide = () => {
            const maxIdx = getMaxIndex();
            if (currentIndex >= maxIdx) {
                currentIndex = 0; // Infinite wrap-around to beginning
            } else {
                currentIndex++;
            }
            updateCarousel();
        };

        const prevSlide = () => {
            const maxIdx = getMaxIndex();
            if (currentIndex <= 0) {
                currentIndex = maxIdx; // Infinite wrap-around to end
            } else {
                currentIndex--;
            }
            updateCarousel();
        };

        // Button Click Handlers
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }

        // Generate dot indicators dynamically
        const createDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const maxIdx = getMaxIndex();
            for (let i = 0; i <= maxIdx; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                    resetAutoPlay();
                });
                dotsContainer.appendChild(dot);
            }
        };

        // Auto-play timer
        const startAutoPlay = () => {
            autoPlayTimer = setInterval(nextSlide, 4500);
        };

        const resetAutoPlay = () => {
            clearInterval(autoPlayTimer);
            startAutoPlay();
        };

        // Responsive resize recalculation
        window.addEventListener('resize', () => {
            createDots();
            if (currentIndex > getMaxIndex()) {
                currentIndex = getMaxIndex();
            }
            updateCarousel();
        });

        // Initialize carousel
        createDots();
        updateCarousel();
        startAutoPlay();
    }

    // 6. MOBILE STICKY SCROLL-DRIVEN HORIZONTAL TIMELINE FOR FUE STEPS
    const fueSection = document.getElementById('fue');
    const fueTrack = document.getElementById('fueStepsTrack');
    const fueWrapper = document.querySelector('.fue-track-wrapper');

    if (fueSection && fueTrack) {
        const handleFueScroll = () => {
            if (window.innerWidth > 768) {
                fueTrack.style.transform = 'none';
                return;
            }

            const sectionTop = fueSection.offsetTop;
            const sectionHeight = fueSection.offsetHeight;
            const viewportHeight = window.innerHeight;
            const maxScroll = sectionHeight - viewportHeight;

            if (maxScroll <= 0) return;

            const scrolled = window.scrollY - sectionTop;
            let progress = scrolled / maxScroll;
            progress = Math.max(0, Math.min(1, progress));

            const trackWidth = fueTrack.scrollWidth;
            const containerWidth = fueWrapper ? fueWrapper.clientWidth : window.innerWidth;
            const maxTranslateX = trackWidth - containerWidth + 24;

            const translateX = progress * maxTranslateX;
            fueTrack.style.transform = `translateX(-${translateX}px)`;
        };

        window.addEventListener('scroll', handleFueScroll, { passive: true });
        window.addEventListener('resize', handleFueScroll, { passive: true });
        handleFueScroll();
    }

    // ==========================================================================
    // 7. LEAD CAPTURE POP-UP MODAL & REAL-TIME VALIDATION LOGIC
    // ==========================================================================
    const leadModal = document.getElementById('leadModal');
    const modalCloseBtn = document.getElementById('modalClose');
    const openModalBtns = document.querySelectorAll('[data-open-modal]');
    const leadForm = document.getElementById('leadForm');

    const leadName = document.getElementById('leadName');
    const leadEmail = document.getElementById('leadEmail');
    const leadPhone = document.getElementById('leadPhone');
    const leadRegion = document.getElementById('leadRegion');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const regionError = document.getElementById('regionError');

    // Open Modal
    const openModal = () => {
        if (!leadModal) return;
        leadModal.classList.add('active');
        leadModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        if (leadName) setTimeout(() => leadName.focus(), 150);
    };

    // Close Modal
    const closeModal = () => {
        if (!leadModal) return;
        leadModal.classList.remove('active');
        leadModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore background scrolling
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (leadModal) {
        // Close on backdrop click
        leadModal.addEventListener('click', (e) => {
            if (e.target === leadModal) {
                closeModal();
            }
        });

        // Close on ESC key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && leadModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Phone Input Auto-Formatting Mask: (XX) 9XXXX-XXXX
    if (leadPhone) {
        leadPhone.addEventListener('input', (e) => {
            let digits = e.target.value.replace(/\D/g, '');
            if (digits.length > 11) digits = digits.slice(0, 11);

            let formatted = '';
            if (digits.length === 0) {
                formatted = '';
            } else if (digits.length <= 2) {
                formatted = `(${digits}`;
            } else if (digits.length <= 7) {
                formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
            } else {
                formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
            }

            e.target.value = formatted;
            validatePhone();
        });
    }

    // Real-Time Validation Functions
    const validateName = () => {
        if (!leadName) return true;
        const val = leadName.value.trim();
        if (val.length < 3) {
            leadName.classList.add('is-invalid');
            leadName.classList.remove('is-valid');
            nameError.innerText = 'Por favor, informe seu nome completo.';
            return false;
        } else {
            leadName.classList.remove('is-invalid');
            leadName.classList.add('is-valid');
            nameError.innerText = '';
            return true;
        }
    };

    const validateEmail = () => {
        if (!leadEmail) return true;
        const val = leadEmail.value.trim();
        // RFC Standard Email Regex + Minimum Top Level Domain length check
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!val) {
            leadEmail.classList.add('is-invalid');
            leadEmail.classList.remove('is-valid');
            emailError.innerText = 'Por favor, informe o seu e-mail.';
            return false;
        } else if (!emailRegex.test(val)) {
            leadEmail.classList.add('is-invalid');
            leadEmail.classList.remove('is-valid');
            emailError.innerText = 'Digite um e-mail válido (ex: nome@exemplo.com).';
            return false;
        } else {
            leadEmail.classList.remove('is-invalid');
            leadEmail.classList.add('is-valid');
            emailError.innerText = '';
            return true;
        }
    };

    const validatePhone = () => {
        if (!leadPhone) return true;
        const rawDigits = leadPhone.value.replace(/\D/g, '');
        
        if (rawDigits.length === 0) {
            leadPhone.classList.add('is-invalid');
            leadPhone.classList.remove('is-valid');
            phoneError.innerText = 'Por favor, informe seu WhatsApp com DDD.';
            return false;
        } else if (rawDigits.length < 11 || rawDigits[2] !== '9') {
            leadPhone.classList.add('is-invalid');
            leadPhone.classList.remove('is-valid');
            phoneError.innerText = 'Informe um WhatsApp válido com DDD (ex: 92 98123-4567).';
            return false;
        } else {
            leadPhone.classList.remove('is-invalid');
            leadPhone.classList.add('is-valid');
            phoneError.innerText = '';
            return true;
        }
    };

    const validateRegion = () => {
        if (!leadRegion) return true;
        const val = leadRegion.value;
        if (!val) {
            leadRegion.classList.add('is-invalid');
            leadRegion.classList.remove('is-valid');
            regionError.innerText = 'Por favor, selecione a sua região.';
            return false;
        } else {
            leadRegion.classList.remove('is-invalid');
            leadRegion.classList.add('is-valid');
            regionError.innerText = '';
            return true;
        }
    };

    // Attach Blur / Input Live Validation Event Listeners
    if (leadName) leadName.addEventListener('blur', validateName);
    if (leadEmail) leadEmail.addEventListener('blur', validateEmail);
    if (leadPhone) leadPhone.addEventListener('blur', validatePhone);
    if (leadRegion) leadRegion.addEventListener('change', validateRegion);

    // Form Submit Handler
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isRegionValid = validateRegion();

            if (!isNameValid || !isEmailValid || !isPhoneValid || !isRegionValid) {
                // Focus first invalid field
                if (!isNameValid) leadName.focus();
                else if (!isEmailValid) leadEmail.focus();
                else if (!isPhoneValid) leadPhone.focus();
                else if (!isRegionValid) leadRegion.focus();
                return;
            }

            // All inputs valid! Format pre-filled WhatsApp message
            const name = leadName.value.trim();
            const email = leadEmail.value.trim();
            const phone = leadPhone.value.trim();
            const region = leadRegion.value;

            const whatsappMessage = `Oi, Dra. Luana, eu me chamo ${name} e gostaria de fazer uma avaliação na sua clínica.`;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=5592992146771&text=${encodedMessage}`;

            // Reset & Close Modal
            closeModal();
            leadForm.reset();
            [leadName, leadEmail, leadPhone, leadRegion].forEach(el => {
                if (el) el.classList.remove('is-valid', 'is-invalid');
            });

            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');
        });
    }
});

