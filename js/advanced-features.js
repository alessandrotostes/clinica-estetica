// Estética Beauty - JavaScript Adicional
// Funcionalidades avançadas para o site de clínica de estética
// Versão 1.0

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Inicialização do carrossel de antes e depois com efeito de deslizar
    initBeforeAfterSlider();
    
    // Contador de estatísticas animado
    initStatCounter();
    
    // Efeito de revelação de imagens
    initImageReveal();
    
    // Efeito de paralaxe suave
    initParallaxEffect();
    
    // Adicionar classe ativa aos links do menu com base na seção atual
    highlightActiveMenuItems();
    
    // Adicionar efeito de hover aos cards de serviços
    initServiceCardHover();
    
    // Inicializar galeria de imagens com lightbox
    initLightboxGallery();
    
    // Adicionar efeito de digitação ao título principal
    initTypingEffect();
    
    // Inicializar animação de números
    initNumberAnimation();
});

// Função para inicializar o carrossel de antes e depois com efeito de deslizar
function initBeforeAfterSlider() {
    const sliders = document.querySelectorAll('.before-after-slider');
    
    sliders.forEach(slider => {
        const sliderHandle = slider.querySelector('.slider-handle');
        const beforeContainer = slider.querySelector('.before-image-container');
        
        if (!sliderHandle || !beforeContainer) return;
        
        let isDragging = false;
        
        // Posição inicial do slider (50%)
        beforeContainer.style.width = '50%';
        sliderHandle.style.left = '50%';
        
        // Função para atualizar a posição do slider
        const updateSliderPosition = (x) => {
            const sliderRect = slider.getBoundingClientRect();
            let position = (x - sliderRect.left) / sliderRect.width * 100;
            
            // Limitar a posição entre 0% e 100%
            position = Math.max(0, Math.min(100, position));
            
            // Atualizar a largura do container "antes"
            beforeContainer.style.width = `${position}%`;
            
            // Atualizar a posição do manipulador
            sliderHandle.style.left = `${position}%`;
        };
        
        // Eventos de mouse
        sliderHandle.addEventListener('mousedown', () => {
            isDragging = true;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSliderPosition(e.clientX);
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Eventos de toque para dispositivos móveis
        sliderHandle.addEventListener('touchstart', () => {
            isDragging = true;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSliderPosition(e.touches[0].clientX);
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        // Clicar diretamente no slider
        slider.addEventListener('click', (e) => {
            updateSliderPosition(e.clientX);
        });
    });
}

// Função para inicializar o contador de estatísticas
function initStatCounter() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    
    const counters = statsSection.querySelectorAll('.stat-number');
    
    const startCounting = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 segundos
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Função de easing para uma animação mais suave
                const easeOutQuad = progress * (2 - progress);
                
                const currentValue = Math.floor(target * easeOutQuad);
                counter.textContent = currentValue.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            requestAnimationFrame(updateCounter);
        });
    };
    
    // Iniciar a contagem quando a seção estiver visível
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startCounting();
            observer.unobserve(statsSection);
        }
    });
    
    observer.observe(statsSection);
}

// Função para inicializar o efeito de revelação de imagens
function initImageReveal() {
    const revealImages = document.querySelectorAll('.reveal-image');
    
    revealImages.forEach(image => {
        // Adicionar overlay para o efeito de revelação
        const overlay = document.createElement('div');
        overlay.classList.add('reveal-overlay');
        image.parentNode.insertBefore(overlay, image.nextSibling);
        
        // Configurar a posição inicial
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.backgroundColor = '#d83f87';
        overlay.style.transform = 'scaleX(1)';
        overlay.style.transformOrigin = 'right';
        overlay.style.transition = 'transform 1.2s cubic-bezier(0.77, 0, 0.175, 1)';
        overlay.style.zIndex = '1';
        
        image.style.opacity = '0';
        image.style.transition = 'opacity 0.5s ease';
        
        // Configurar o container para posicionamento relativo
        image.parentNode.style.position = 'relative';
        image.parentNode.style.overflow = 'hidden';
        
        // Função para revelar a imagem quando estiver visível
        const revealImage = () => {
            overlay.style.transform = 'scaleX(0)';
            image.style.opacity = '1';
        };
        
        // Observar quando a imagem estiver visível
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(revealImage, 300); // Pequeno atraso para melhor efeito
                observer.unobserve(image);
            }
        });
        
        observer.observe(image);
    });
}

// Função para inicializar o efeito de paralaxe
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const offset = scrollTop * speed;
            
            element.style.transform = `translateY(${offset}px)`;
        });
    });
}

// Função para destacar itens de menu ativos com base na seção atual
function highlightActiveMenuItems() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 200; // Offset para melhor detecção
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href && href.includes(current)) {
                link.classList.add('active');
            } else if (href === 'index.html' && current === '') {
                link.classList.add('active');
            }
        });
    });
}

// Função para adicionar efeito de hover aos cards de serviços
function initServiceCardHover() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
            
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.classList.add('pulse-animation');
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
            
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.classList.remove('pulse-animation');
            }
        });
    });
}

// Função para inicializar galeria de imagens com lightbox
function initLightboxGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            const imgAlt = this.querySelector('img').getAttribute('alt');
            
            // Criar o lightbox
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            lightbox.style.position = 'fixed';
            lightbox.style.top = '0';
            lightbox.style.left = '0';
            lightbox.style.width = '100%';
            lightbox.style.height = '100%';
            lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            lightbox.style.display = 'flex';
            lightbox.style.alignItems = 'center';
            lightbox.style.justifyContent = 'center';
            lightbox.style.zIndex = '9999';
            lightbox.style.opacity = '0';
            lightbox.style.transition = 'opacity 0.3s ease';
            
            // Conteúdo do lightbox
            const content = document.createElement('div');
            content.style.maxWidth = '90%';
            content.style.maxHeight = '90%';
            content.style.position = 'relative';
            content.style.transform = 'scale(0.9)';
            content.style.transition = 'transform 0.3s ease';
            
            // Imagem
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = imgAlt;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '90vh';
            img.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.3)';
            img.style.borderRadius = '5px';
            
            // Botão de fechar
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '-40px';
            closeBtn.style.right = '0';
            closeBtn.style.background = 'none';
            closeBtn.style.border = 'none';
            closeBtn.style.color = 'white';
            closeBtn.style.fontSize = '30px';
            closeBtn.style.cursor = 'pointer';
            
            // Adicionar elementos ao DOM
            content.appendChild(img);
            content.appendChild(closeBtn);
            lightbox.appendChild(content);
            document.body.appendChild(lightbox);
            
            // Impedir rolagem do body
            document.body.style.overflow = 'hidden';
            
            // Animar a entrada
            setTimeout(() => {
                lightbox.style.opacity = '1';
                content.style.transform = 'scale(1)';
            }, 10);
            
            // Função para fechar o lightbox
            const closeLightbox = () => {
                lightbox.style.opacity = '0';
                content.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = 'auto';
                }, 300);
            };
            
            // Eventos para fechar
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
            
            // Fechar com tecla ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeLightbox();
                }
            });
        });
    });
}

// Função para adicionar efeito de digitação ao título principal
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-effect');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    typingElement.style.borderRight = '2px solid #d83f87';
    
    let charIndex = 0;
    const typingSpeed = 100; // Velocidade de digitação em ms
    
    function typeText() {
        if (charIndex < text.length) {
            typingElement.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, typingSpeed);
        } else {
            // Remover o cursor após a digitação
            setTimeout(() => {
                typingElement.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Iniciar a digitação quando o elemento estiver visível
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(typeText, 500); // Pequeno atraso antes de iniciar
            observer.unobserve(typingElement);
        }
    });
    
    observer.observe(typingElement);
}

// Função para inicializar animação de números
function initNumberAnimation() {
    const animatedNumbers = document.querySelectorAll('.animate-number');
    
    animatedNumbers.forEach(number => {
        const finalValue = parseInt(number.getAttribute('data-value'));
        number.textContent = '0';
        
        const animateValue = () => {
            let startValue = 0;
            const duration = 2000; // 2 segundos
            const increment = finalValue / (duration / 16); // 60fps
            
            const updateValue = () => {
                startValue += increment;
                
                if (startValue < finalValue) {
                    number.textContent = Math.floor(startValue).toLocaleString();
                    requestAnimationFrame(updateValue);
                } else {
                    number.textContent = finalValue.toLocaleString();
                }
            };
            
            requestAnimationFrame(updateValue);
        };
        
        // Iniciar a animação quando o elemento estiver visível
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateValue();
                observer.unobserve(number);
            }
        });
        
        observer.observe(number);
    });
}
