const SPLINE_RUNTIME_URL =
  "https://unpkg.com/@splinetool/runtime@1.12.98/build/runtime.js";
const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export const TECHNOLOGY_IDLE_DELAY_MS = 3200;

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

export async function createTechnologyScene({canvas, reducedMotion, onReady}) {
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

  onReady?.({motionEnabled: !reducedMotion});

  return {
    dispose() {
      interaction.dispose();
      app.dispose?.();
    }
  };
}
