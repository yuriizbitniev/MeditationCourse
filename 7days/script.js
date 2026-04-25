document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Логика FAQ (Аккордеон) --- */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Закрыть все остальные (если нужно поведение аккордеона)
            document.querySelectorAll('.faq-question').forEach(btn => {
                btn.classList.remove('active');
                btn.nextElementSibling.style.maxHeight = null;
            });

            // Если не был открыт, открываем
            if (!isActive) {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    /* --- 2. Анимация появления при скролле (Intersection Observer) --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Элемент появляется, когда 15% его видно на экране
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Остановка наблюдения после появления
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    /* --- 3. Sticky шапка при скролле --- */
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- 4. Плавный скролл для якорей --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Высота липкой шапки
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* --- 5. Слайдер Отзывов (Драг, Автоскролл, Кнопки) --- */
    const slider = document.querySelector('.reviews-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Расчет прокрутки (по одной карточке в зависимости от экрана)
        const getScrollAmount = () => {
            if (window.innerWidth >= 1024) return slider.clientWidth / 3;
            if (window.innerWidth >= 768) return slider.clientWidth / 2;
            return slider.clientWidth;
        };

        const scrollNext = () => {
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
                // Возврат в начало
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            }
        };

        const scrollPrev = () => {
            slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        };

        nextBtn?.addEventListener('click', () => {
            scrollNext();
            resetAutoplay(); /* сбросить таймер автоплей */
        });

        prevBtn?.addEventListener('click', () => {
            scrollPrev();
            resetAutoplay();
        });

        // Драг (перетаскивание мышью для ПК)
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.scrollBehavior = 'auto'; // Выключаем плавный скролл при драге
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.scrollBehavior = 'smooth';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.scrollBehavior = 'smooth';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Множитель скорости скролла
            slider.scrollLeft = scrollLeft - walk;
        });

        // Автоскролл
        let autoplayInterval = setInterval(scrollNext, 4000); // каждые 4 сек

        const resetAutoplay = () => {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(scrollNext, 4000);
        };

        // Останавливаем автоплей при взаимодействии
        slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        slider.addEventListener('mouseleave', resetAutoplay);
        slider.addEventListener('touchstart', () => clearInterval(autoplayInterval), { passive: true });
        slider.addEventListener('touchend', resetAutoplay, { passive: true });
    }



});
