// c:\Users\jgvsilva\Desktop\site pessoal\assets\js\main.js

// PARTÍCULAS
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];

window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    canvas.style.transform = `translateY(${scrolled * 0.1}px)`;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0; if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0; if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = "rgba(16,185,129,0.3)";
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < 60; i++) particlesArray.push(new Particle());
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = dx * dx + dy * dy;
            if (distance < 15000) {
                ctx.strokeStyle = `rgba(16,185,129,${1 - distance/15000})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
}
init(); animate();

// GLOBO
// --- 2. LÓGICA DO GLOBO (ATAQUES + BRILHO + FOCO) ---

// Base de dados expandida para evitar "N/A" nos principais países
const cyberData = {
    // Américas
    "Brazil": { leaks: "45.2M", phishing: "12.1M", intrusions: "1.2M" },
    "United States of America": { leaks: "128.5M", phishing: "42.3M", intrusions: "5.1M" },
    "Mexico": { leaks: "22.1M", phishing: "8.4M", intrusions: "600k" },
    "Argentina": { leaks: "12.4M", phishing: "3.2M", intrusions: "150k" },
    "Canada": { leaks: "18.2M", phishing: "6.1M", intrusions: "400k" },
    "Colombia": { leaks: "9.5M", phishing: "2.8M", intrusions: "110k" },
    "Chile": { leaks: "5.1M", phishing: "1.5M", intrusions: "85k" },

    // Europa
    "Russia": { leaks: "92.4M", phishing: "31.2M", intrusions: "8.4M" },
    "Germany": { leaks: "15.8M", phishing: "5.2M", intrusions: "820k" },
    "France": { leaks: "14.1M", phishing: "4.9M", intrusions: "750k" },
    "United Kingdom": { leaks: "22.5M", phishing: "9.4M", intrusions: "1.1M" },
    "Italy": { leaks: "11.2M", phishing: "3.1M", intrusions: "400k" },
    "Spain": { leaks: "9.8M", phishing: "2.7M", intrusions: "320k" },
    "Portugal": { leaks: "2.1M", phishing: "800k", intrusions: "45k" },
    "Ukraine": { leaks: "35.2M", phishing: "10.1M", intrusions: "4.2M" },

    // Ásia e Oceania
    "China": { leaks: "215.4M", phishing: "82.5M", intrusions: "14.8M" },
    "India": { leaks: "142.1M", phishing: "58.2M", intrusions: "9.2M" },
    "Japan": { leaks: "10.5M", phishing: "2.1M", intrusions: "300k" },
    "South Korea": { leaks: "12.8M", phishing: "4.2M", intrusions: "550k" },
    "Australia": { leaks: "8.4M", phishing: "2.5M", intrusions: "210k" },
    "Israel": { leaks: "18.2M", phishing: "7.4M", intrusions: "3.1M" },

    // África
    "South Africa": { leaks: "11.2M", phishing: "4.1M", intrusions: "280k" },
    "Nigeria": { leaks: "15.4M", phishing: "9.2M", intrusions: "450k" },
    "Egypt": { leaks: "8.1M", phishing: "2.4M", intrusions: "180k" }
};

// Coordenadas fixas dos principais países para garantir que os ataques saiam de terra firme
const countryCoords = {
    "Brazil": { lat: -14.235, lng: -51.925 },
    "United States of America": { lat: 37.090, lng: -95.712 },
    "China": { lat: 35.861, lng: 104.195 },
    "Russia": { lat: 61.524, lng: 105.318 },
    "India": { lat: 20.593, lng: 78.962 },
    "Germany": { lat: 51.165, lng: 10.451 },
    "United Kingdom": { lat: 55.378, lng: -3.436 },
    "France": { lat: 46.227, lng: 2.213 },
    "South Africa": { lat: -30.559, lng: 22.937 },
    "Australia": { lat: -25.274, lng: 133.775 },
    "Canada": { lat: 56.130, lng: -106.346 },
    "Japan": { lat: 36.204, lng: 138.252 },
    "Mexico": { lat: 23.634, lng: -102.552 },
    "Ukraine": { lat: 48.379, lng: 31.165 },
    "Israel": { lat: 31.046, lng: 34.851 }
};

// Gera ataques cibernéticos aleatórios (Arcos Animados)
const arcsData = [...Array(40).keys()].map(() => {
    // Seleciona países aleatórios da lista de coordenadas
    const countries = Object.values(countryCoords);
    const start = countries[Math.floor(Math.random() * countries.length)];
    let end = countries[Math.floor(Math.random() * countries.length)];
    
    // Garante que o destino não seja o mesmo que a origem
    while (start === end) end = countries[Math.floor(Math.random() * countries.length)];

    return {
        startLat: start.lat,
        startLng: start.lng,
        endLat: end.lat,
        endLng: end.lng,
        // Gradiente: Cor Sólida -> Transparente (Efeito de rastro/cometa)
        color: [['#10b981', 'rgba(16, 185, 129, 0)'], ['#ef4444', 'rgba(239, 68, 68, 0)'], ['#3b82f6', 'rgba(59, 130, 246, 0)']][Math.floor(Math.random() * 3)],
        altitude: Math.random() * 0.4 + 0.1, // Altura variada
        gap: Math.random() * 3 + 1, // Intervalo aleatório para desincronizar
        initialGap: Math.random() * 2 // Atraso inicial para não saírem todos juntos
    };
});

const world = Globe()
    (document.getElementById('globeViz'))
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl(null)
    
    // Atmosfera (Glow Cyber)
    .atmosphereColor('#10b981')
    .atmosphereAltitude(0.15)
    
    // Configuração dos Ataques (Arcos)
    .arcsData(arcsData)
    .arcColor('color')
    .arcAltitude('altitude')
    .arcDashLength(0.4) // Rastro mais curto (parece um feixe)
    .arcDashGap(d => d.gap) // Gap variável para fluxo contínuo
    .arcDashInitialGap(d => d.initialGap) // Desincroniza o início
    .arcDashAnimateTime(4000) // Mais lento (4 segundos)
    .arcStroke(0.5)
    
    // Configuração do Brilho de Clique (Anéis pulsantes)
    .ringColor(() => '#10b981')
    .ringMaxRadius(10)
    .ringPropagationSpeed(3)
    .ringRepeatPeriod(800)

    // Visual dos Países
    .polygonCapColor(() => 'rgba(16, 185, 129, 0.1)')
    .polygonSideColor(() => 'rgba(0, 0, 0, 0.2)')
    .polygonStrokeColor(() => '#10b981')
    
    // INTERAÇÃO DE CLIQUE
    .onPolygonClick((polygon, event, { lat, lng, altitude }) => {
        // Cria o efeito de brilho no local exato do clique
        world.ringsData([{ lat, lng }]);
        
        // Move a câmera suavemente para o país clicado
        world.pointOfView({ lat, lng, altitude: 2 }, 1000);
    })

    // TOOLTIP PERSONALIZADO
    .polygonLabel(({ properties: d }) => {
        const stats = cyberData[d.NAME] || { leaks: "Monitorado", phishing: "Protegido", intrusions: "< 1k" };
        return `
            <div class="glass p-4 rounded-lg border border-emerald-500/50 shadow-2xl" 
                 style="background: rgba(10, 10, 12, 0.95); pointer-events: none; color: white; min-width: 180px;">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <b class="text-emerald-400 text-xl uppercase tracking-tight">${d.NAME}</b>
                </div>
                <hr class="border-white/10 my-2">
                <div class="space-y-1 text-sm mono">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Vazamentos:</span> 
                        <span class="text-red-400 font-bold">${stats.leaks}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Phishing:</span> 
                        <span class="text-yellow-400 font-bold">${stats.phishing}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Invasões:</span> 
                        <span class="text-blue-400 font-bold">${stats.intrusions}</span>
                    </div>
                </div>
            </div>
        `;
    })
    .onPolygonHover(hoverD => world
        .polygonCapColor(d => d === hoverD ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.1)')
    );

// Carregar fronteiras GeoJSON
fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
    .then(res => res.json())
    .then(countries => world.polygonsData(countries.features));

// Controles Automáticos
world.controls().autoRotate = true;
world.controls().autoRotateSpeed = 0.5;
world.controls().enableZoom = false;

// Ajuste de Responsividade
window.addEventListener("resize", () => {
    world.width(document.getElementById('globeViz').offsetWidth);
    world.height(document.getElementById('globeViz').offsetHeight);
});

// --- LÓGICA DO RASTRO VERDE DINÂMICO ---
let hueValue = 140; // Começa em um verde água
let direction = 1;

window.addEventListener('mousemove', (e) => {
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    
    // Define a posição
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;

    // Variação lenta da paleta verde (entre o tom 120 e 160 do HSL)
    hueValue += 0.2 * direction;
    if (hueValue > 160 || hueValue < 120) direction *= -1;

    const color = `hsl(${hueValue}, 80%, 50%)`;
    dot.style.backgroundColor = color;
    dot.style.boxShadow = `0 0 10px ${color}`;

    document.body.appendChild(dot);

    // Remove o elemento após a animação terminar
    setTimeout(() => {
        dot.remove();
    }, 700);
});

// --- LÓGICA DO HUD LOADER (3 SEGUNDOS + DICAS) ---
const loaderText = document.getElementById('loader-text');
const phrases = [
    "[SYSTEM_BOOT_SEQUENCE...]",
    "Inicializando protocolos de segurança...",
    "Verificando integridade dos dados...",
    "Estabelecendo conexão criptografada...",
    "Analisando métricas de risco...",
    "[SECURE_CONNECTION_ESTABLISHED]"
];

let phraseIdx = 0;

function typePhrase() {
    if (phraseIdx < phrases.length) {
        let i = 0;
        loaderText.textContent = ""; // Limpa para a próxima frase (Mais seguro que innerHTML)
        
        function typeChar() {
            if (i < phrases[phraseIdx].length) {
                loaderText.textContent += phrases[phraseIdx].charAt(i);
                i++;
                setTimeout(typeChar, 30); // Velocidade da digitação
            } else {
                // Tempo que a frase fica exposta antes de mudar
                setTimeout(() => {
                    phraseIdx++;
                    typePhrase();
                }, 400); 
            }
        }
        typeChar();
    }
}

typePhrase();

// Força o carregamento a durar pelo menos 3 segundos (3500ms para garantir as frases)
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('loader-hidden');
    }, 1000); 
});

// --- ANIMAÇÃO DO CONTADOR LIVE ---
const counterElement = document.getElementById('live-counter');
setInterval(() => {
    // Gera um número aleatório entre 800 e 950 para simular tráfego
    const randomValue = Math.floor(Math.random() * (950 - 800 + 1)) + 800;
    counterElement.innerText = randomValue;
    // Adiciona um efeito de cor momentâneo
    counterElement.style.color = '#10b981';
    setTimeout(() => counterElement.style.color = 'white', 200);
}, 2000);

// --- SCROLL REVEAL (ANIMAÇÃO AO ROLAR) ---
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Opcional: Parar de observar após animar uma vez
            // observer.unobserve(entry.target); 
        }
    });
}, {
    root: null,
    threshold: 0.15 // Ativa quando 15% do elemento estiver visível
});

revealElements.forEach(el => revealObserver.observe(el));
