
(function () {
  const canvas = document.getElementById("scene");
  const recenterBtn = document.getElementById("recenter");
  const crumbsEl = document.getElementById("crumbs");
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x05070c, 1);

  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera();
  cam.position.set(0, 0, 10);
  cam.zoom = 1;

  function updateCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const size = 12;
    cam.left = -size * aspect;
    cam.right = size * aspect;
    cam.top = size;
    cam.bottom = -size;
    cam.near = -100;
    cam.far = 100;
    cam.updateProjectionMatrix();
  }
  updateCamera();

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    updateCamera();
  });

  const bgParticles = [];
  (function addStars() {
    const count = 90;
    for (let i = 0; i < count; i++) {
      const g = new THREE.CircleGeometry(0.025 + Math.random() * 0.05, 20);
      const m = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.12 + Math.random() * 0.16
      });
      const p = new THREE.Mesh(g, m);
      p.position.set((Math.random() - 0.5) * 110, (Math.random() - 0.5) * 75, -5);
      p.userData.seed = Math.random() * 1000;
      p.userData.base = p.position.clone();
      p.userData.range = 0.25 + Math.random() * 0.55;
      scene.add(p);
      bgParticles.push(p);
    }
  })();

  const data = {
    name: "Ha Dao",
    kind: "root",
    children: [
      {
        name: "About Me",
        kind: "info",
        children: [
          {
            name: "Bio",
            kind: "detail",
            children: [
              { name: "Photo", kind: "micro", children: [] },
              { name: "Description", kind: "micro", children: [] },
              { name: "Timeline", kind: "micro", children: [] }
            ]
          },
          {
            name: "Skills",
            kind: "detail",
            children: [
              { name: "Tools", kind: "micro", children: [] },
              { name: "Process", kind: "micro", children: [] },
              { name: "Strengths", kind: "micro", children: [] }
            ]
          },
          {
            name: "Values",
            kind: "detail",
            children: [
              { name: "Beliefs", kind: "micro", children: [] },
              { name: "Approach", kind: "micro", children: [] },
              { name: "Goals", kind: "micro", children: [] }
            ]
          }
        ]
      },
      {
        name: "User Experience",
        kind: "category",
        children: [
          {
            name: "Course Selector",
            kind: "project",
            children: [
              { name: "Photo", kind: "micro", children: [] },
              { name: "Description", kind: "micro", children: [] },
              { name: "Process", kind: "micro", children: [] }
            ]
          },
          {
            name: "Accessibility Campaign",
            kind: "project",
            children: [
              { name: "Photo", kind: "micro", children: [] },
              { name: "Description", kind: "micro", children: [] },
              { name: "Outcome", kind: "micro", children: [] }
            ]
          }
        ]
      },
      {
        name: "Cinematography",
        kind: "category",
        children: [
          {
            name: "Short Film",
            kind: "project",
            children: [
              { name: "Still", kind: "micro", children: [] },
              { name: "Description", kind: "micro", children: [] },
              { name: "Credits", kind: "micro", children: [] }
            ]
          },
          {
            name: "Motion Study",
            kind: "project",
            children: [
              { name: "Frame", kind: "micro", children: [] },
              { name: "Description", kind: "micro", children: [] },
              { name: "Notes", kind: "micro", children: [] }
            ]
          }
        ]
      },
      {
        name: "Graphic Design",
        kind: "category",
        children: [
          {
            name: "Poster Series",
            kind: "project",
            children: [
              { name: "Poster", kind: "micro", children: [] },
              { name: "Description", kind: "micro", children: [] },
              { name: "Style", kind: "micro", children: [] }
            ]
          },
          {
            name: "Brand Assets",
            kind: "project",
            children: [
              { name: "Logo", kind: "micro", children: [] },
              { name: "Description", kind: "micro", children: [] },
              { name: "System", kind: "micro", children: [] }
            ]
          }
        ]
      }
    ]
  };

  function walk(node, parent = null, depth = 0) {
    node.parent = parent;
    node.depth = depth;
    node.expanded = depth === 0;
    (node.children || []).forEach(child => walk(child, node, depth + 1));
  }
  walk(data);

  const categoryColors = {
    "About Me": "#B8B0D9",
    "User Experience": "#6ED6B8",
    "Cinematography": "#6FA8FF",
    "Graphic Design": "#FF8C73"
  };

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const num = parseInt(clean, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(v => {
      const s = Math.max(0, Math.min(255, Math.round(v))).toString(16);
      return s.length === 1 ? "0" + s : s;
    }).join("");
  }
  function mix(hex1, hex2, t) {
    const a = hexToRgb(hex1), b = hexToRgb(hex2);
    return rgbToHex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
  }
  function rootCategory(node) {
    let cur = node;
    while (cur.parent && cur.parent !== data) cur = cur.parent;
    return cur === data ? null : cur;
  }
  function bubbleColor(node) {
    if (node.kind === "root") return "#D9D9DF";
    if (node.depth === 1) return categoryColors[node.name] || "#8FA8FF";
    const top = rootCategory(node);
    const base = top ? (categoryColors[top.name] || "#8FA8FF") : "#8FA8FF";
    if (node.kind === "project") return mix(base, "#FFFFFF", 0.18);
    if (node.kind === "micro") return mix(base, "#FFFFFF", 0.42);
    return mix(base, "#FFFFFF", 0.32);
  }

  function makeBubbleTexture(label, fill, showX) {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 512;
    const ctx = c.getContext("2d");
    const r = 256;

    ctx.save();
    ctx.beginPath(); ctx.arc(r, r, r - 5, 0, Math.PI * 2); ctx.closePath(); ctx.clip();

    const grad = ctx.createRadialGradient(r * 0.72, r * 0.68, 0, r, r, r);
    grad.addColorStop(0, "rgba(255,255,255,0.42)");
    grad.addColorStop(0.18, "rgba(255,255,255,0.14)");
    grad.addColorStop(1, fill);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 14; i++) {
      const x = Math.random() * 512, y = Math.random() * 512, rr = 30 + Math.random() * 90;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rr);
      g.addColorStop(0, "rgba(255,255,255,0.35)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "rgba(255,255,255,0.24)";
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(r, r, r - 12, 0, Math.PI * 2); ctx.stroke();

    const spec = ctx.createRadialGradient(r * 0.68, r * 0.65, 0, r * 0.68, r * 0.65, r * 0.82);
    spec.addColorStop(0, "rgba(255,255,255,0.42)");
    spec.addColorStop(0.35, "rgba(255,255,255,0.12)");
    spec.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = spec;
    ctx.beginPath(); ctx.arc(r * 0.68, r * 0.65, r * 0.82, 0, Math.PI * 2); ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255,0.98)";
    ctx.strokeStyle = "rgba(0,0,0,0.62)";
    ctx.lineJoin = "round";

    const maxWidth = 330;
    const words = label.split(" ");
    let fontSize = 62, lines = [];
    function wrapAtSize(size) {
      ctx.font = `700 ${size}px Arial`;
      const out = []; let line = "";
      for (const word of words) {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width <= maxWidth) line = test;
        else { if (line) out.push(line); line = word; }
      }
      if (line) out.push(line);
      return out;
    }
    while (fontSize > 20) {
      lines = wrapAtSize(fontSize);
      const longest = Math.max(...lines.map(l => ctx.measureText(l).width));
      if (lines.length <= 3 && longest <= maxWidth) break;
      fontSize -= 4;
    }
    ctx.font = `700 ${fontSize}px Arial`;
    ctx.lineWidth = Math.max(4, fontSize * 0.12);
    const lineHeight = fontSize * 1.02;
    const totalHeight = (lines.length - 1) * lineHeight;
    const startY = r - totalHeight / 2;
    lines.forEach((line, i) => {
      const y = startY + i * lineHeight;
      ctx.strokeText(line, r, y); ctx.fillText(line, r, y);
    });

    if (showX) {
      const bx = 418, by = 96, br = 34;
      ctx.fillStyle = "rgba(0,0,0,0.48)";
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.80)";
      ctx.lineWidth = 5; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(bx - 12, by - 12); ctx.lineTo(bx + 12, by + 12);
      ctx.moveTo(bx + 12, by - 12); ctx.lineTo(bx - 12, by + 12);
      ctx.stroke();
    }

    ctx.restore();
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let bubbles = [];
  let animatingOut = false;

  function visibleNodes() {
    const out = [];
    function visit(node) {
      out.push(node);
      if (node.expanded) (node.children || []).forEach(visit);
    }
    visit(data);
    return out;
  }

  function radiusFor(node) {
    if (node.kind === "root") return 2.9;
    if (node.depth === 1) return 1.75;
    if (node.kind === "project") return 1.22;
    if (node.kind === "micro") return 0.72;
    return 0.98;
  }

  function createBubble(node) {
    const radius = radiusFor(node);
    const tex = makeBubbleTexture(node.name, bubbleColor(node), node.kind !== "root");
    const geom = new THREE.CircleGeometry(radius, 72);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.72 });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.userData.node = node;
    mesh.userData.radius = radius;
    mesh.userData.home = new THREE.Vector3();
    mesh.userData.scaleTarget = 1;
    mesh.userData.floatSeed = Math.random() * 1000;
    mesh.userData.fade = 1;
    mesh.userData.removing = false;
    scene.add(mesh);
    bubbles.push(mesh);
    return mesh;
  }

  function disposeBubble(b) {
    scene.remove(b);
    if (b.material.map) b.material.map.dispose();
    b.material.dispose();
    b.geometry.dispose();
  }
  function clearBubbles() {
    while (bubbles.length) disposeBubble(bubbles.pop());
  }

  function buildHomes(map) {
    const rootMesh = map.get(data);
    rootMesh.userData.home.set(0, 0, 0);

    const first = data.children || [];
    const rootR = radiusFor(data);
    const ring = rootR + 3.6;
    const step = (Math.PI * 2) / Math.max(1, first.length);

    first.forEach((node, i) => {
      const mesh = map.get(node);
      const angle = -Math.PI / 2 + i * step;
      const rr = ring + (i % 2) * 0.18;
      mesh.userData.home.set(Math.cos(angle) * rr, Math.sin(angle) * rr, 0);
      node._anchorAngle = angle;
    });

    function layoutChildren(parent) {
      if (!parent.expanded || !(parent.children || []).length) return;
      const parentMesh = map.get(parent);
      if (!parentMesh) return;

      const kids = parent.children.filter(c => map.has(c));
      if (!kids.length) return;

      const pm = parentMesh.userData.home;
      const parentAngle = Math.atan2(pm.y, pm.x || 0.0001);
      const baseAngle = parent === data ? 0 : parentAngle;

      const spread = ({1:0,2:0.52,3:0.88,4:1.18,5:1.42,6:1.62})[Math.min(kids.length,6)] || Math.min(1.9, 0.55 + kids.length * 0.24);
      const maxKidR = Math.max(...kids.map(k => radiusFor(k)));
      const childDist = radiusFor(parent) + 2.55 + maxKidR * 1.05 + Math.max(0, kids.length - 3) * 0.24;

      kids.forEach((child, idx) => {
        const mesh = map.get(child);
        const t = kids.length === 1 ? 0 : (idx / (kids.length - 1) - 0.5);
        const angle = baseAngle + t * spread;
        const d = childDist + idx * (maxKidR * 0.18);
        mesh.userData.home.set(pm.x + Math.cos(angle) * d, pm.y + Math.sin(angle) * d, 0);
        child._anchorAngle = angle;
      });

      kids.forEach(layoutChildren);
    }
    first.forEach(layoutChildren);
  }

  function assignLayout(previousPositions = new Map(), emergingFrom = new Set()) {
    const nodes = visibleNodes();
    const map = new Map();
    clearBubbles();
    nodes.forEach(n => map.set(n, createBubble(n)));
    buildHomes(map);

    nodes.forEach(node => {
      const mesh = map.get(node);
      const parent = node.parent;
      if (previousPositions.has(node)) mesh.position.copy(previousPositions.get(node));
      else if (emergingFrom.has(node) && parent && previousPositions.has(parent)) mesh.position.copy(previousPositions.get(parent));
      else if (!parent) mesh.position.copy(mesh.userData.home);
      else if (previousPositions.has(parent)) mesh.position.copy(previousPositions.get(parent));
      else mesh.position.copy(mesh.userData.home);
    });

    updateCrumbs();
  }

  function updateCrumbs() {
    if (!crumbsEl) return;
    const parts = [];
    function collect(node) {
      parts.push(node.name);
      const openChild = (node.children || []).find(c => c.expanded);
      if (openChild) collect(openChild);
    }
    collect(data);
    crumbsEl.textContent = parts.join("  ›  ");
  }

  function collapseBranch(node) {
    (node.children || []).forEach(child => {
      child.expanded = false;
      collapseBranch(child);
    });
  }

  function openNode(node) {
    const previousPositions = new Map();
    bubbles.forEach(b => previousPositions.set(b.userData.node, b.position.clone()));
    node.expanded = true;
    assignLayout(previousPositions, new Set(node.children || []));
  }

  function closeNodeAnimated(node) {
    if (animatingOut || !(node.children && node.children.length)) return;
    animatingOut = true;

    const toRemove = new Set();
    function gather(n) {
      (n.children || []).forEach(child => {
        if (child.expanded) gather(child);
        toRemove.add(child);
      });
    }
    gather(node);

    const parentBubble = bubbles.find(b => b.userData.node === node);
    const targetPos = parentBubble ? parentBubble.position.clone() : new THREE.Vector3();

    bubbles.forEach(b => {
      if (toRemove.has(b.userData.node)) {
        b.userData.removing = true;
        b.userData.removeTarget = targetPos.clone();
      }
    });

    setTimeout(() => {
      collapseBranch(node);
      node.expanded = false;
      const previousPositions = new Map();
      bubbles.forEach(b => {
        if (!b.userData.removing) previousPositions.set(b.userData.node, b.position.clone());
      });
      assignLayout(previousPositions, new Set());
      animatingOut = false;
    }, 260);
  }

  function toggleNode(node) {
    if (!(node.children && node.children.length) || animatingOut) return;
    if (node.expanded) closeNodeAnimated(node);
    else openNode(node);
  }

  function goUpFrom(node) {
    if (!node || !node.parent || animatingOut) return;
    closeNodeAnimated(node);
  }

  function setPointerFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function hitObject() {
    raycaster.setFromCamera(pointer, cam);
    const hits = raycaster.intersectObjects(bubbles, false);
    return hits.length ? hits[0].object : null;
  }

  function localPointOnMesh(mesh, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const v = new THREE.Vector3(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -(((clientY - rect.top) / rect.height) * 2 - 1),
      0
    );
    v.unproject(cam);
    return mesh.worldToLocal(v.clone());
  }

  function hitX(mesh, clientX, clientY) {
    if (!mesh || mesh.userData.node.kind === "root") return false;
    const local = localPointOnMesh(mesh, clientX, clientY);
    const r = mesh.userData.radius;
    const bx = r * 0.63, by = r * 0.63, br = r * 0.19;
    const dx = local.x - bx, dy = local.y - by;
    return dx * dx + dy * dy <= br * br;
  }

  let hovered = null;
  window.addEventListener("pointermove", (e) => {
    setPointerFromEvent(e);
    const hit = hitObject();
    hovered = hit;
    bubbles.forEach(b => b.userData.scaleTarget = 1);
    if (hit) hit.userData.scaleTarget = 1.08;
    document.body.style.cursor = hit ? "pointer" : "default";
  });

  window.addEventListener("click", (e) => {
    if (animatingOut) return;
    setPointerFromEvent(e);
    const hit = hitObject();
    if (!hit) return;
    const node = hit.userData.node;

    if (hitX(hit, e.clientX, e.clientY)) {
      goUpFrom(node);
      return;
    }
    if (node === data && node.expanded) return;
    if (node.children && node.children.length) toggleNode(node);
  });

  let panning = false, lastX = 0, lastY = 0;
  canvas.addEventListener("contextmenu", e => e.preventDefault());
  canvas.addEventListener("pointerdown", (e) => {
    if (e.button === 2) {
      panning = true;
      lastX = e.clientX; lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!panning) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    const vw = (cam.right - cam.left) / cam.zoom;
    const vh = (cam.top - cam.bottom) / cam.zoom;
    cam.position.x -= (dx / window.innerWidth) * vw;
    cam.position.y += (dy / window.innerHeight) * vh;
  });
  canvas.addEventListener("pointerup", (e) => {
    panning = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
  });

  canvas.addEventListener("wheel", (e) => {
    const factor = 1.12;
    if (e.deltaY > 0) cam.zoom /= factor;
    else cam.zoom *= factor;
    cam.zoom = Math.max(0.25, Math.min(5.5, cam.zoom));
    cam.updateProjectionMatrix();
    e.preventDefault();
  }, { passive: false });

  if (recenterBtn) {
    recenterBtn.addEventListener("click", () => {
      cam.position.set(0, 0, 10);
      cam.zoom = 1;
      cam.updateProjectionMatrix();
    });
  }

  assignLayout(new Map(), new Set());

  function animate(t) {
    requestAnimationFrame(animate);
    const time = t * 0.001;

    bgParticles.forEach((p) => {
      const s = p.userData.seed, r = p.userData.range;
      p.position.x = p.userData.base.x + Math.sin(time * 0.14 + s) * r;
      p.position.y = p.userData.base.y + Math.cos(time * 0.11 + s * 0.7) * r * 0.8;
      p.material.opacity = 0.09 + (Math.sin(time * 0.5 + s) + 1) * 0.04;
    });

    bubbles = bubbles.filter(b => {
      let targetX, targetY;
      if (b.userData.removing && b.userData.removeTarget) {
        targetX = b.userData.removeTarget.x;
        targetY = b.userData.removeTarget.y;
        b.userData.fade += (0 - b.userData.fade) * 0.24;
      } else {
        const home = b.userData.home, seed = b.userData.floatSeed;
        const floatX = Math.sin(time * 0.55 + seed) * 0.08;
        const floatY = Math.cos(time * 0.48 + seed * 1.3) * 0.10;
        let hoverX = 0, hoverY = 0;
        if (hovered === b) {
          hoverX = Math.sin(time * 7 + seed) * 0.04;
          hoverY = Math.cos(time * 8 + seed) * 0.04;
        }
        targetX = home.x + floatX + hoverX;
        targetY = home.y + floatY + hoverY;
        b.userData.fade += (1 - b.userData.fade) * 0.12;
      }

      b.position.x += (targetX - b.position.x) * 0.11;
      b.position.y += (targetY - b.position.y) * 0.11;

      const sTarget = b.userData.scaleTarget || 1;
      const sNow = b.scale.x + (sTarget - b.scale.x) * 0.14;
      b.scale.set(sNow, sNow, 1);
      b.material.opacity = 0.72 * b.userData.fade;

      if (b.userData.removing && b.userData.fade < 0.03) {
        disposeBubble(b);
        return false;
      }
      return true;
    });

    renderer.render(scene, cam);
  }
  animate(0);
})();
