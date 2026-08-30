const SPLINE_RUNTIME_URL =
  "https://unpkg.com/@splinetool/runtime@1.12.98/build/runtime.js";
const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export const TECHNOLOGY_IDLE_DELAY_MS = 3200;

const ARM_EVENT_NAMES = new Set([
  "Hand LEFT",
  "arm",
  "elbow",
  "forearm",
  "Hand"
]);
const PALM_ANCHOR = {x: -5, y: 14, z: 12};

let runtimePromise;

const loadSplineRuntime = () => {
  if (!runtimePromise) {
    runtimePromise = import(
      /* webpackIgnore: true */
      SPLINE_RUNTIME_URL
    );
  }
  return runtimePromise;
};

const isUsableRect = rect =>
  rect &&
  [rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) &&
  rect.width > 0 &&
  rect.height > 0;

export const resolveTechnologyCenterPoint = rect => {
  if (!isUsableRect(rect)) {
    return null;
  }

  return {
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2
  };
};

const dispatchIdlePointer = (target, point) => {
  if (!point) {
    return;
  }

  const markSynthetic = event => {
    Object.defineProperty(event, "__technologyIdlePointer", {
      value: true
    });
    return event;
  };

  const eventInit = {
    bubbles: true,
    clientX: point.clientX,
    clientY: point.clientY,
    button: 0,
    buttons: 0
  };

  if (typeof window.PointerEvent === "function") {
    target.dispatchEvent(
      markSynthetic(
        new window.PointerEvent("pointermove", {
          ...eventInit,
          pointerType: "mouse",
          isPrimary: true
        })
      )
    );
  }

  target.dispatchEvent(
    markSynthetic(new window.MouseEvent("mousemove", eventInit))
  );
};

export const createTechnologySceneInteraction = ({
  app,
  canvas,
  reducedMotion,
  pointerTarget = window,
  setTimer = (callback, delay) => window.setTimeout(callback, delay),
  clearTimer = timer => window.clearTimeout(timer)
}) => {
  let idleTimer = null;
  let disposed = false;

  const clearIdleTimer = () => {
    if (idleTimer !== null) {
      clearTimer(idleTimer);
      idleTimer = null;
    }
  };

  const enterIdle = () => {
    idleTimer = null;
    if (disposed || reducedMotion) {
      return;
    }

    dispatchIdlePointer(
      pointerTarget,
      resolveTechnologyCenterPoint(canvas.getBoundingClientRect())
    );
  };

  const scheduleIdle = () => {
    clearIdleTimer();
    if (!disposed && !reducedMotion) {
      idleTimer = setTimer(enterIdle, TECHNOLOGY_IDLE_DELAY_MS);
    }
  };

  const onPointerMove = event => {
    if (
      event.__technologyIdlePointer ||
      event.pointerType === "touch" ||
      event.isPrimary === false
    ) {
      return;
    }

    scheduleIdle();
  };

  if (reducedMotion) {
    app.setGlobalEvents?.(false);
    app.stop?.();

    return {
      dispose() {
        disposed = true;
        clearIdleTimer();
        app.setGlobalEvents?.(false);
      }
    };
  }

  app.setGlobalEvents?.(true);
  pointerTarget.addEventListener("pointermove", onPointerMove, {passive: true});
  scheduleIdle();

  return {
    dispose() {
      disposed = true;
      clearIdleTimer();
      pointerTarget.removeEventListener("pointermove", onPointerMove);
      app.setGlobalEvents?.(false);
    }
  };
};

const findPresentationHand = app => {
  const hands = [];
  app._scene?.traverse?.(object => {
    if (object.name === "Hand" && object.isMesh) {
      const worldPosition = object.position.clone();
      object.getWorldPosition(worldPosition);
      hands.push({object, worldX: worldPosition.x});
    }
  });

  hands.sort((left, right) => right.worldX - left.worldX);
  return hands[0]?.object || null;
};

export const resolvePalmClientPoint = ({normalizedX, normalizedY, rect}) => {
  if (
    !isUsableRect(rect) ||
    !Number.isFinite(normalizedX) ||
    !Number.isFinite(normalizedY)
  ) {
    return null;
  }

  return {
    clientX: rect.left + normalizedX * rect.width,
    clientY: rect.top + normalizedY * rect.height,
    inView:
      normalizedX >= 0 &&
      normalizedX <= 1 &&
      normalizedY >= 0 &&
      normalizedY <= 1
  };
};

const createPalmProjection = ({app, canvas, onPosition}) => {
  const hand = findPresentationHand(app);
  const camera = app._camera;
  if (!hand || !camera) {
    return {
      available: false,
      setPresentation() {},
      dispose() {}
    };
  }

  let animationFrame = null;
  let visible = false;
  let disposed = false;
  const worldAnchor = hand.position.clone();
  const projectedAnchor = hand.position.clone();

  const updatePosition = () => {
    if (disposed) {
      return;
    }

    hand.updateWorldMatrix(true, false);
    worldAnchor.set(PALM_ANCHOR.x, PALM_ANCHOR.y, PALM_ANCHOR.z);
    hand.localToWorld(worldAnchor);
    projectedAnchor.copy(worldAnchor).project(camera);

    const point = resolvePalmClientPoint({
      normalizedX: (projectedAnchor.x + 1) / 2,
      normalizedY: (1 - projectedAnchor.y) / 2,
      rect: canvas.getBoundingClientRect()
    });
    if (point) {
      onPosition?.({...point, visible});
    }

    animationFrame = window.requestAnimationFrame(updatePosition);
  };

  animationFrame = window.requestAnimationFrame(updatePosition);

  return {
    available: true,
    setPresentation(presentation) {
      visible = Boolean(presentation?.visible);
    },
    dispose() {
      disposed = true;
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    }
  };
};

const findArmEventTargets = app => {
  const startEvents = app.getSplineEvents?.()?.start || {};
  return Object.keys(startEvents)
    .map(id => app.findObjectById?.(id))
    .filter(object => object && ARM_EVENT_NAMES.has(object.name));
};

export const createTechnologyPresentationController = ({
  app,
  projection,
  reducedMotion
}) => {
  const armTargets = reducedMotion ? [] : findArmEventTargets(app);
  let presentationActive = false;

  const moveArms = direction => {
    armTargets.forEach(target => {
      if (direction === "present") {
        target.emitEvent?.("start");
      } else {
        target.emitEventReverse?.("start");
      }
    });
  };

  moveArms("rest");

  return {
    palmProjectionAvailable: projection.available,
    setPresentation(presentation) {
      const nextActive = Boolean(presentation?.visible);
      if (nextActive !== presentationActive) {
        moveArms(nextActive ? "present" : "rest");
        presentationActive = nextActive;
      }
      projection.setPresentation(presentation);
    },
    dispose() {
      projection.dispose();
    }
  };
};

export async function createTechnologyScene({
  canvas,
  reducedMotion,
  onReady,
  onPalmPosition
}) {
  const runtime = await loadSplineRuntime();
  const Application = runtime?.Application;
  if (!Application) {
    throw new Error("Spline runtime could not be loaded.");
  }

  const app = new Application(canvas);

  try {
    await app.load(SPLINE_SCENE_URL);
  } catch (error) {
    app.dispose?.();
    throw error;
  }

  const interaction = createTechnologySceneInteraction({
    app,
    canvas,
    reducedMotion
  });

  const projection = createPalmProjection({
    app,
    canvas,
    onPosition: onPalmPosition
  });
  const presentation = createTechnologyPresentationController({
    app,
    projection,
    reducedMotion
  });

  onReady?.({
    motionEnabled: !reducedMotion,
    palmProjectionAvailable: presentation.palmProjectionAvailable
  });

  return {
    setPresentation(nextPresentation) {
      presentation.setPresentation(nextPresentation);
    },
    dispose() {
      presentation.dispose();
      interaction.dispose();
      app.dispose?.();
    }
  };
}
