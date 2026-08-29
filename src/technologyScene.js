const STACK_ORDER = ["ship", "move", "build", "see"];

const LAYER_GEOMETRY = {
  ship: {y: 0, width: 3.55},
  move: {y: 0.82, width: 3.05},
  build: {y: 1.64, width: 2.6},
  see: {y: 2.46, width: 2.15}
};

const SLAB_HEIGHT = 0.3;
const NODE_SIZE = 0.27;

const readSceneColors = element => {
  const style = window.getComputedStyle(element);
  const read = (name, fallback) =>
    style.getPropertyValue(name).trim() || fallback;

  return {
    accent: read("--accent", "#e8a94f"),
    ink: read("--ink", "#eee5d1"),
    inkSoft: read("--ink-soft", "#c1b7a3"),
    inkFaint: read("--ink-faint", "#857c6d"),
    signal: read("--signal", "#70c5d2")
  };
};

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);

export async function createTechnologyScene({
  canvas,
  container,
  capabilitiesData,
  stateRef,
  reducedMotion,
  onReady
}) {
  const THREE = await import("three");

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "low-power"
    });
  } catch {
    return null;
  }

  if (!renderer || !renderer.getContext?.()) {
    renderer?.dispose?.();
    return null;
  }

  const colors = readSceneColors(container);
  const accentColor = new THREE.Color(colors.accent);
  const inkColor = new THREE.Color(colors.ink);
  const inkSoftColor = new THREE.Color(colors.inkSoft);
  const inkFaintColor = new THREE.Color(colors.inkFaint);
  const signalColor = new THREE.Color(colors.signal);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  const cameraTarget = new THREE.Vector3(0, 1.28, 0);

  const disposables = [];
  const track = resource => {
    disposables.push(resource);
    return resource;
  };

  scene.add(new THREE.AmbientLight(0xffffff, 0.92));
  const keyLight = new THREE.DirectionalLight(accentColor, 1.05);
  keyLight.position.set(4.5, 7.5, 5.5);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(signalColor, 0.35);
  rimLight.position.set(-5, 3, -4.5);
  scene.add(rimLight);

  const stack = new THREE.Group();
  scene.add(stack);

  const grid = new THREE.GridHelper(9.5, 19, inkFaintColor, inkFaintColor);
  grid.material.transparent = true;
  grid.material.opacity = 0.14;
  grid.position.y = -0.62;
  track(grid.geometry);
  track(grid.material);
  stack.add(grid);

  const spineGeometry = track(new THREE.CylinderGeometry(0.035, 0.035, 4, 10));
  const spineMaterial = track(
    new THREE.MeshBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.42
    })
  );
  const spine = new THREE.Mesh(spineGeometry, spineMaterial);
  spine.position.y = 1.42;
  stack.add(spine);

  const layers = new Map();
  const nodesById = new Map();

  capabilitiesData.forEach(capability => {
    const layout = LAYER_GEOMETRY[capability.id] || LAYER_GEOMETRY.build;
    const group = new THREE.Group();
    group.position.y = layout.y;

    const slabGeometry = track(
      new THREE.BoxGeometry(layout.width, SLAB_HEIGHT, layout.width)
    );
    const slabMaterial = track(
      new THREE.MeshStandardMaterial({
        color: inkFaintColor,
        transparent: true,
        opacity: 0.16,
        roughness: 0.9,
        metalness: 0.05
      })
    );
    const slab = new THREE.Mesh(slabGeometry, slabMaterial);
    group.add(slab);

    const edgesGeometry = track(new THREE.EdgesGeometry(slabGeometry));
    const edgesMaterial = track(
      new THREE.LineBasicMaterial({
        color: inkSoftColor,
        transparent: true,
        opacity: 0.5
      })
    );
    group.add(new THREE.LineSegments(edgesGeometry, edgesMaterial));

    const nodeGeometry = track(
      new THREE.BoxGeometry(NODE_SIZE, NODE_SIZE, NODE_SIZE)
    );
    const nodeRadius = layout.width * 0.31;
    capability.technologyIds.forEach((technologyId, index) => {
      const angle =
        (index / capability.technologyIds.length) * Math.PI * 2 +
        Math.PI * 0.25;
      const nodeMaterial = track(
        new THREE.MeshStandardMaterial({
          color: inkSoftColor,
          emissive: accentColor,
          emissiveIntensity: 0,
          transparent: true,
          opacity: 0.85,
          roughness: 0.75,
          metalness: 0.1
        })
      );
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(
        Math.cos(angle) * nodeRadius,
        SLAB_HEIGHT / 2 + NODE_SIZE * 0.72,
        Math.sin(angle) * nodeRadius
      );
      const nodeEdges = new THREE.LineSegments(
        track(new THREE.EdgesGeometry(nodeGeometry)),
        track(
          new THREE.LineBasicMaterial({
            color: inkColor,
            transparent: true,
            opacity: 0.35
          })
        )
      );
      node.add(nodeEdges);
      group.add(node);
      nodesById.set(technologyId, {mesh: node, material: nodeMaterial});
    });

    stack.add(group);
    layers.set(capability.id, {
      group,
      baseY: layout.y,
      lift: 0,
      highlight: 0,
      slabMaterial,
      edgesMaterial
    });
  });

  const beamGeometry = track(new THREE.CylinderGeometry(0.02, 0.05, 1.5, 8));
  const beamMaterial = track(
    new THREE.MeshBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.55
    })
  );
  const beam = new THREE.Mesh(beamGeometry, beamMaterial);
  beam.visible = false;
  stack.add(beam);

  const pointer = {x: 0, y: 0};
  let dragOffset = 0;
  let dragging = null;
  let animationFrame = 0;
  let running = true;
  const startTime = performance.now();

  const fit = () => {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const stackIndexOf = id => {
    const index = STACK_ORDER.indexOf(id);
    return index === -1 ? 1 : index;
  };

  const applyState = immediate => {
    const {activeId, technologyId} = stateRef.current;
    const activeIndex = stackIndexOf(activeId);

    layers.forEach((layer, layerId) => {
      const layerIndex = stackIndexOf(layerId);
      const isActive = layerId === activeId;
      const targetLift =
        layerIndex > activeIndex ? 0.52 : isActive ? 0.24 : 0;
      const targetHighlight = isActive ? 1 : 0;

      if (immediate) {
        layer.lift = targetLift;
        layer.highlight = targetHighlight;
      } else {
        layer.lift += (targetLift - layer.lift) * 0.085;
        layer.highlight += (targetHighlight - layer.highlight) * 0.11;
      }

      layer.group.position.y = layer.baseY + layer.lift;
      layer.slabMaterial.opacity = 0.14 + layer.highlight * 0.14;
      layer.slabMaterial.color
        .copy(inkFaintColor)
        .lerp(accentColor, layer.highlight * 0.55);
      layer.edgesMaterial.opacity = 0.42 + layer.highlight * 0.5;
      layer.edgesMaterial.color
        .copy(inkSoftColor)
        .lerp(accentColor, layer.highlight);
    });

    nodesById.forEach((node, nodeId) => {
      const selected = nodeId === technologyId;
      const targetScale = selected ? 1.5 : 1;
      const targetGlow = selected ? 0.85 : 0;
      const current = node.mesh.scale.x;
      const nextScale = immediate
        ? targetScale
        : current + (targetScale - current) * 0.14;
      node.mesh.scale.setScalar(nextScale);
      node.material.emissiveIntensity = immediate
        ? targetGlow
        : node.material.emissiveIntensity +
          (targetGlow - node.material.emissiveIntensity) * 0.14;
      node.material.opacity = selected ? 1 : 0.85;
    });

    const selectedNode = nodesById.get(technologyId);
    const selectedLayer = layers.get(activeId);
    if (selectedNode && selectedLayer) {
      beam.visible = true;
      const worldY = selectedLayer.group.position.y;
      beam.position.set(
        selectedNode.mesh.position.x,
        worldY + selectedNode.mesh.position.y + 0.95,
        selectedNode.mesh.position.z
      );
    }
  };

  const positionCamera = elapsed => {
    const autoYaw = reducedMotion ? 0 : elapsed * 0.00005;
    const azimuth = -0.68 + autoYaw + dragOffset + pointer.x * 0.4;
    const polar = clampValue(1.12 - pointer.y * 0.2, 0.74, 1.38);
    const radius = 9.6;

    camera.position.set(
      cameraTarget.x + radius * Math.sin(polar) * Math.sin(azimuth),
      cameraTarget.y + radius * Math.cos(polar),
      cameraTarget.z + radius * Math.sin(polar) * Math.cos(azimuth)
    );
    camera.lookAt(cameraTarget);
  };

  const renderFrame = timestamp => {
    const elapsed = (timestamp || performance.now()) - startTime;
    applyState(false);

    if (!reducedMotion) {
      const bob = Math.sin(elapsed * 0.0011) * 0.045;
      stack.position.y = bob;
      const selectedNode = nodesById.get(stateRef.current.technologyId);
      if (selectedNode) {
        selectedNode.mesh.rotation.y = elapsed * 0.0012;
      }
      beamMaterial.opacity = 0.4 + Math.sin(elapsed * 0.0032) * 0.18;
    }

    positionCamera(elapsed);
    renderer.render(scene, camera);
  };

  const loop = timestamp => {
    if (!running) {
      return;
    }
    renderFrame(timestamp);
    animationFrame = window.requestAnimationFrame(loop);
  };

  const renderOnce = () => {
    applyState(true);
    positionCamera(0);
    renderer.render(scene, camera);
  };

  const onPointerMove = event => {
    const rect = container.getBoundingClientRect();
    if (dragging !== null) {
      dragOffset = dragging.offset + (event.clientX - dragging.x) * 0.008;
      if (reducedMotion) {
        renderOnce();
      }
      return;
    }
    if (reducedMotion || event.pointerType === "touch") {
      return;
    }
    pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    pointer.y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
  };

  const onPointerDown = event => {
    dragging = {x: event.clientX, offset: dragOffset};
    container.setPointerCapture?.(event.pointerId);
  };

  const onPointerUp = () => {
    dragging = null;
  };

  const onPointerLeave = () => {
    pointer.x = 0;
    pointer.y = 0;
  };

  const onResize = () => {
    fit();
    if (reducedMotion) {
      renderOnce();
    }
  };

  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  container.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("resize", onResize);

  fit();

  if (reducedMotion) {
    renderOnce();
  } else {
    animationFrame = window.requestAnimationFrame(loop);
  }

  onReady?.();

  return {
    refresh() {
      if (reducedMotion) {
        renderOnce();
      }
    },
    dispose() {
      running = false;
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      disposables.forEach(resource => resource.dispose?.());
      renderer.dispose();
    }
  };
}
