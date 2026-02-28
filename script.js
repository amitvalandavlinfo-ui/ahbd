const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.5 ? '#d4af37' : '#b76e79';
        this.alpha = Math.random();
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.alpha > 0.01) this.alpha -= 0.002;
        if (this.alpha <= 0.01 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.alpha = 1;
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

const textToType = "Happy Birthday Ashlesha 🎉✨";
const typeTarget = document.getElementById('typing-target');
let charIndex = 0;

function typeWriter() {
    if (charIndex < textToType.length) {
        let char = textToType.charAt(charIndex);
        typeTarget.innerHTML += char;
        charIndex++;
        setTimeout(typeWriter, 100);
    } else {
        revealQuote();
    }
}

function revealQuote() {
    gsap.to('.cursor', { opacity: 0, display: 'none' });
    gsap.to('.quote-container', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: startPageTransition
    });
}

function startPageTransition() {
    setTimeout(() => {
        const tl = gsap.timeline();
        tl.to('#intro-screen', {
            yPercent: -100,
            duration: 1.5,
            ease: "power4.inOut"
        })
            .to('#main-content', {
                autoAlpha: 1,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    initGalleryAnimations();
                    createFloatingHearts();
                    ScrollTrigger.refresh();
                }
            }, "-=0.5");
    }, 3000);
}

window.onload = () => {
    setTimeout(typeWriter, 1000);
};

let currentAudio = null;
let currentBtn = null;

function playAudio(id, card) {
    const audio = document.getElementById(id);
    const icon = card.querySelector('.play-icon');

    if (currentAudio === audio && !audio.paused) {
        audio.pause();
        card.classList.remove('playing');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        currentAudio = null;
        return;
    }

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentBtn) {
            currentBtn.classList.remove('playing');
            currentBtn.querySelector('.play-icon').classList.remove('fa-pause');
            currentBtn.querySelector('.play-icon').classList.add('fa-play');
        }
    }

    audio.play();
    card.classList.add('playing');
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');

    currentAudio = audio;
    currentBtn = card;

    audio.onended = () => {
        card.classList.remove('playing');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        currentAudio = null;
    };
}

gsap.registerPlugin(ScrollTrigger);

function initGalleryAnimations() {
    gsap.utils.toArray('.left-entry').forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            x: -100,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('.right-entry').forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            x: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('.scale-entry').forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: "back.out(1.7)"
        });
    });
}

function createFloatingHearts() {
    const container = document.body;
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 7 + 's';
        heart.style.opacity = Math.random();
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        container.appendChild(heart);
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }, 800);
}