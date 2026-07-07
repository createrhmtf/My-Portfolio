(function initParticleField() {
    const canvas = document.querySelector("#bg-canvas");
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const count = window.innerWidth < 720 ? 1500 : 3200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorA = new THREE.Color("#ffffff");
    const colorB = new THREE.Color("#a855f7");
    const colorC = new THREE.Color("#38bdf8");

    for (let i = 0; i < count; i += 1) {
        const index = i * 3;
        positions[index] = (Math.random() - 0.5) * 100;
        positions[index + 1] = (Math.random() - 0.5) * 100;
        positions[index + 2] = (Math.random() - 0.5) * 100;

        const mixed = colorA.clone().lerp(i % 3 === 0 ? colorB : colorC, Math.random() * 0.55);
        colors[index] = mixed.r;
        colors[index + 1] = mixed.g;
        colors[index + 2] = mixed.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    function starTexture() {
        const textureCanvas = document.createElement("canvas");
        textureCanvas.width = 32;
        textureCanvas.height = 32;
        const ctx = textureCanvas.getContext("2d");
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 15);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.45, "rgba(255,255,255,0.75)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(16, 16, 15, 0, Math.PI * 2);
        ctx.fill();
        return new THREE.CanvasTexture(textureCanvas);
    }

    const material = new THREE.PointsMaterial({
        size: 0.16,
        map: starTexture(),
        transparent: true,
        opacity: 0.84,
        vertexColors: true,
        sizeAttenuation: true,
        depthWrite: false
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    camera.position.z = 20;

    let mouseX = 0;
    let mouseY = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.00008;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.00008;
    }, { passive: true });

    function animate() {
        if (!reducedMotion) {
            stars.rotation.y += 0.00025 + mouseX * 0.22;
            stars.rotation.x += 0.00008 + mouseY * 0.22;
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    });
}());
