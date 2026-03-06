// c:\Users\jgvsilva\Desktop\site pessoal\assets\js\main.js

// --- PARTÍCULAS ---
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];
const isTouchLike = window.matchMedia("(pointer: coarse)").matches;

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
    const particleCount = isTouchLike ? 30 : 60;
    for (let i = 0; i < particleCount; i++) particlesArray.push(new Particle());
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

// --- GLOBO INTERATIVO (DESKTOP) + FALLBACK LEVE MOBILE ---
const isMobileView = window.matchMedia("(max-width: 900px)").matches || window.matchMedia("(pointer: coarse)").matches;
const globeElement = document.getElementById("globeViz");

function formatMetric(value) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${Math.round(value / 1000)}k`;
    return `${value}`;
}

if (globeElement && !isMobileView && typeof Globe === "function") {
    const countryAttackStats = {
        "Brazil": { attacks: 1200000, phishing: 12100000, leaks: 45200000, risk: "Alto" },
        "United States of America": { attacks: 5100000, phishing: 42300000, leaks: 128500000, risk: "Crítico" },
        "Canada": { attacks: 400000, phishing: 6100000, leaks: 18200000, risk: "Médio" },
        "Mexico": { attacks: 600000, phishing: 8400000, leaks: 22100000, risk: "Alto" },
        "United Kingdom": { attacks: 1100000, phishing: 9400000, leaks: 22500000, risk: "Alto" },
        "Germany": { attacks: 820000, phishing: 5200000, leaks: 15800000, risk: "Médio" },
        "France": { attacks: 750000, phishing: 4900000, leaks: 14100000, risk: "Médio" },
        "India": { attacks: 9200000, phishing: 58200000, leaks: 142100000, risk: "Crítico" },
        "China": { attacks: 14800000, phishing: 82500000, leaks: 215400000, risk: "Crítico" },
        "Japan": { attacks: 300000, phishing: 2100000, leaks: 10500000, risk: "Médio" },
        "Australia": { attacks: 210000, phishing: 2500000, leaks: 8400000, risk: "Baixo" },
        "South Africa": { attacks: 280000, phishing: 4100000, leaks: 11200000, risk: "Médio" },
        "Nigeria": { attacks: 450000, phishing: 9200000, leaks: 15400000, risk: "Alto" },
        "Egypt": { attacks: 180000, phishing: 2400000, leaks: 8100000, risk: "Baixo" }
    };

    const nodes = [
        { country: "Brazil", lat: -23.5505, lng: -46.6333, level: "high" },
        { country: "United States of America", lat: 40.7128, lng: -74.0060, level: "high" },
        { country: "Canada", lat: 43.6532, lng: -79.3832, level: "medium" },
        { country: "Mexico", lat: 19.4326, lng: -99.1332, level: "medium" },
        { country: "United Kingdom", lat: 51.5072, lng: -0.1276, level: "high" },
        { country: "Germany", lat: 50.1109, lng: 8.6821, level: "medium" },
        { country: "France", lat: 48.8566, lng: 2.3522, level: "medium" },
        { country: "Spain", lat: 40.4168, lng: -3.7038, level: "low" },
        { country: "Turkey", lat: 39.9334, lng: 32.8597, level: "medium" },
        { country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, level: "low" },
        { country: "India", lat: 19.0760, lng: 72.8777, level: "high" },
        { country: "China", lat: 39.9042, lng: 116.4074, level: "high" },
        { country: "Japan", lat: 35.6895, lng: 139.6917, level: "medium" },
        { country: "South Korea", lat: 37.5665, lng: 126.9780, level: "medium" },
        { country: "Singapore", lat: 1.3521, lng: 103.8198, level: "medium" },
        { country: "Indonesia", lat: -6.2088, lng: 106.8456, level: "medium" },
        { country: "Australia", lat: -33.8688, lng: 151.2093, level: "low" },
        { country: "South Africa", lat: -26.2041, lng: 28.0473, level: "medium" },
        { country: "Nigeria", lat: 6.5244, lng: 3.3792, level: "high" },
        { country: "Egypt", lat: 30.0444, lng: 31.2357, level: "low" }
    ];

    const colors = {
        high: { rgb: "239,68,68", point: "#f87171", stroke: 1.0 }, 
        medium: { rgb: "59,130,246", point: "#60a5fa", stroke: 0.8 },
        low: { rgb: "16,185,129", point: "#34d399", stroke: 0.6 }
    };

    function pickPair() {
        let a = nodes[Math.floor(Math.random() * nodes.length)];
        let b = nodes[Math.floor(Math.random() * nodes.length)];
        let tries = 0;
        while ((a === b || Math.hypot(a.lat - b.lat, a.lng - b.lng) < 28) && tries < 15) {
            a = nodes[Math.floor(Math.random() * nodes.length)];
            b = nodes[Math.floor(Math.random() * nodes.length)];
            tries += 1;
        }
        return [a, b];
    }

    // --- INSTÂNCIA DO GLOBO ---
    const world = Globe()(globeElement)
        .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-dark.jpg")
        .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
        .backgroundImageUrl(null)
        .atmosphereColor("#10b981")
        .atmosphereAltitude(0.17)
        .arcColor(d => [d.colorStart, d.colorEnd]) // Faz o degradê na rota inteira pro rastro ficar natural
        .arcAltitude("arcAltitude")
        .arcStroke("arcStroke")
        
        // --- EFEITO COMETA / LASER ---
        .arcDashLength(0.4) // Ocupa 40% da rota, criando o rastro
        .arcDashGap(4) // Gap gigante para garantir que seja apenas 1 míssil por rota.
        .arcDashInitialGap(() => 0) 
        .arcDashAnimateTime("travelMs") 
        .arcsTransitionDuration(0) 
        // -----------------------------
        
        .arcLabel(d => `${d.fromLabel} -> ${d.toLabel}`)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor("color")
        .pointAltitude(() => 0.01)
        .pointRadius(() => 0.14)
        .pointsMerge(true)
        .polygonCapColor(() => "rgba(16,185,129,0.08)")
        .polygonSideColor(() => "rgba(0,0,0,0.2)")
        .polygonStrokeColor(() => "rgba(16,185,129,0.72)")
        .polygonLabel(({ properties }) => {
            const name = properties?.NAME || "Região";
            const stats = countryAttackStats[name] || { attacks: 90000, phishing: 420000, leaks: 1700000, risk: "Monitorado" };
            return `
                <div class="glass p-4 rounded-lg border border-emerald-500/40"
                     style="background: rgba(10,10,12,0.95); color: white; min-width: 180px;">
                    <div class="text-emerald-400 text-sm font-bold uppercase mb-2">${name}</div>
                    <div class="space-y-1 text-xs mono">
                        <div class="flex justify-between"><span class="text-gray-400">Ataques:</span><span class="text-red-400">${formatMetric(stats.attacks)}</span></div>
                        <div class="flex justify-between"><span class="text-gray-400">Phishing:</span><span class="text-yellow-300">${formatMetric(stats.phishing)}</span></div>
                        <div class="flex justify-between"><span class="text-gray-400">Vazamentos:</span><span class="text-blue-300">${formatMetric(stats.leaks)}</span></div>
                        <div class="flex justify-between"><span class="text-gray-400">Risco:</span><span class="text-emerald-300">${stats.risk}</span></div>
                    </div>
                </div>
            `;
        })
        .onPolygonHover(hoverD => {
            world
                .polygonCapColor(d => (d === hoverD ? "rgba(16,185,129,0.34)" : "rgba(16,185,129,0.08)"))
                .polygonStrokeColor(d => (d === hoverD ? "rgba(52,211,153,0.95)" : "rgba(16,185,129,0.72)"));
        });

    // Linhas de ataque desativadas
    world.arcsData([]);
    world.pointsData([]);

    // Carregamento do GeoJSON
    fetch("https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson")
        .then(res => res.json())
        .then(countries => world.polygonsData(countries.features))
        .catch(() => world.polygonsData([]));

    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.34;
    world.controls().enableZoom = true;
    world.controls().minDistance = 180;
    world.controls().maxDistance = 410;
    world.controls().enablePan = false;

    world.width(globeElement.offsetWidth);
    world.height(globeElement.offsetHeight);
    window.addEventListener("resize", () => {
        world.width(globeElement.offsetWidth);
        world.height(globeElement.offsetHeight);
    });
}

// --- LÓGICA DO RASTRO VERDE DINÂMICO ---
let hueValue = 140; 
let direction = 1;

if (!isTouchLike) {
    window.addEventListener('mousemove', (e) => {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;

        hueValue += 0.2 * direction;
        if (hueValue > 160 || hueValue < 120) direction *= -1;

        const color = `hsl(${hueValue}, 80%, 50%)`;
        dot.style.backgroundColor = color;
        dot.style.boxShadow = `0 0 10px ${color}`;

        document.body.appendChild(dot);

        setTimeout(() => {
            dot.remove();
        }, 700);
    });
}

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
        loaderText.textContent = ""; 
        
        function typeChar() {
            if (i < phrases[phraseIdx].length) {
                loaderText.textContent += phrases[phraseIdx].charAt(i);
                i++;
                setTimeout(typeChar, 30); 
            } else {
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

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('loader-hidden');
    }, 1000); 
});

// --- ANIMAÇÃO DO CONTADOR LIVE ---
const counterElement = document.getElementById('live-counter');
setInterval(() => {
    const randomValue = Math.floor(Math.random() * (950 - 800 + 1)) + 800;
    counterElement.innerText = randomValue;
    counterElement.style.color = '#10b981';
    setTimeout(() => counterElement.style.color = 'white', 200);
}, 2000);

// --- SCROLL REVEAL (ANIMAÇÃO AO ROLAR) ---
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    root: null,
    threshold: 0.15 
});

revealElements.forEach(el => revealObserver.observe(el));
