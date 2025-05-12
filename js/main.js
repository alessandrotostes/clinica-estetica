// Estética Beauty - JavaScript Principal
// Desenvolvido para site de clínica de estética
// Versão 1.0

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Inicialização do AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Botão Voltar ao Topo
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Rolagem suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Fechar menu mobile se estiver aberto
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            }
        });
    });

    // Inicialização de todos os tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicialização de todos os popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Carrossel de Antes e Depois - Configurações adicionais
    const beforeAfterCarousel = document.getElementById('beforeAfterCarousel');
    if (beforeAfterCarousel) {
        const carousel = new bootstrap.Carousel(beforeAfterCarousel, {
            interval: 5000,
            wrap: true,
            touch: true
        });
        
        // Pausar o carrossel ao passar o mouse
        beforeAfterCarousel.addEventListener('mouseenter', function() {
            carousel.pause();
        });
        
        // Retomar o carrossel ao remover o mouse
        beforeAfterCarousel.addEventListener('mouseleave', function() {
            carousel.cycle();
        });
    }

    // Carrossel de Depoimentos - Configurações adicionais
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    if (testimonialCarousel) {
        const carousel = new bootstrap.Carousel(testimonialCarousel, {
            interval: 6000,
            wrap: true,
            touch: true
        });
    }

    // Efeito de revelação ao rolar a página
    function revealOnScroll() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        
        revealElements.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Executar uma vez ao carregar a página

    // Contador de números para estatísticas (se houver)
    function startCounter() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 100;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(startCounter, 30);
            } else {
                counter.innerText = target;
            }
        });
    }
    
    // Iniciar contador quando a seção estiver visível
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounter();
                observer.unobserve(statsSection);
            }
        });
        
        observer.observe(statsSection);
    }

    // Adicionar classe 'scrolled' ao menu quando a página é rolada
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Galeria de imagens com lightbox (se houver)
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                const imgAlt = this.querySelector('img').getAttribute('alt');
                
                const lightbox = document.createElement('div');
                lightbox.classList.add('lightbox');
                
                const lightboxContent = `
                    <div class="lightbox-content">
                        <img src="${imgSrc}" alt="${imgAlt}">
                        <span class="lightbox-close">&times;</span>
                    </div>
                `;
                
                lightbox.innerHTML = lightboxContent;
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';
                
                lightbox.addEventListener('click', function(e) {
                    if (e.target === this || e.target.classList.contains('lightbox-close')) {
                        document.body.removeChild(lightbox);
                        document.body.style.overflow = 'auto';
                    }
                });
            });
        });
    }

    // Animação para os números de estatísticas
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Aplicar animação aos elementos com classe 'animate-number'
    const animateNumbers = () => {
        document.querySelectorAll('.animate-number').forEach(el => {
            const finalValue = parseInt(el.getAttribute('data-final-value'));
            animateValue(el, 0, finalValue, 2000);
        });
    };

    // Verificar se os elementos estão visíveis na tela
    const animateNumbersSection = document.querySelector('.stats-section');
    if (animateNumbersSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateNumbers();
                observer.unobserve(animateNumbersSection);
            }
        });
        
        observer.observe(animateNumbersSection);
    }
});
