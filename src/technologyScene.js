const SPLINE_RUNTIME_URL =
  "https://unpkg.com/@splinetool/runtime@1.12.98/build/runtime.js";
const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export const TECHNOLOGY_FOCUS_HOLD_MS = 1050;
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

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const isUsableRect = rect =>
  rect &&
  [rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) &&
  rect.width > 0 &&
  rect.height > 0;

export const resolveTechnologyFocusPoint = ({canvasRect, targetRect}) => {
  if (!isUsableRect(canvasRect) || !isUsableRect(targetRect)) {
    return null;
  }

  const targetCenterY = targetRect.top + targetRect.height / 2;
  const relativeY = clamp(
    (targetCenterY - canvasRect.top) / canvasRect.height,
    0.18,
    0.82
  );

  return {
    clientX: canvasRect.left + canvasRect.width * 0.14,
    clientY: canvasRect.top + canvasRect.height * relativeY
  };
};

const resolveTechnologyCenterPoint = canvasRect => {
  if (!isUsableRect(canvasRect)) {
    return null;
  }

  return {
    clientX: canvasRect.left + canvasRect.width / 2,
    clientY: canvasRect.top + canvasRect.height / 2
  };
};

const dispatchScenePointer = (target, point) => {
  if (!point) {
    return;
  }

  const eventInit = {
    bubbles: true,
    clientX: point.clientX,
    clientY: point.clientY,
    button: 0,
    buttons: 0
  };

  if (typeof window.PointerEvent === "function") {
    target.dispatchEvent(
      new window.PointerEvent("pointermove", {
        ...eventInit,
        pointerType: "mouse",
        isPrimary: true
      })
    );
  }

  target.dispatchEvent(new window.MouseEvent("mousemove", eventInit));
};

export const createTechnologySceneInteraction = ({
  app,
  canvas,
  reducedMotion,
  pointerTarget = window,
  setTimer = (callback, delay) => window.setTimeout(callback, delay),
  clearTimer = timer => window.clearTimeout(timer)
}) => {
  let focusTimer = null;
  let idleTimer = null;
  let idle = false;
  let disposed = false;

  const clearFocusTimer = () => {
    if (focusTimer !== null) {
      clearTimer(focusTimer);
      focusTimer = null;
    }
  };

  const clearIdleTimer = () => {
    if (idleTimer !== null) {
      clearTimer(idleTimer);
      idleTimer = null;
    }
  };

  const enableGlobalEvents = () => app.setGlobalEvents?.(true);
  const disableGlobalEvents = () => app.setGlobalEvents?.(false);

  const pointSceneAt = point => {
    dispatchScenePointer(canvas, point);
  };

  const returnToCenter = () => {
    pointSceneAt(
      resolveTechnologyCenterPoint(canvas.getBoundingClientRect())
    );
  };

  const enterIdle = () => {
    idleTimer = null;
    if (disposed || reducedMotion || focusTimer !== null) {
      return;
    }

    idle = true;
    disableGlobalEvents();
    returnToCenter();
  };

  const scheduleIdle = () => {
    clearIdleTimer();
    if (!disposed && !reducedMotion) {
      idleTimer = setTimer(enterIdle, TECHNOLOGY_IDLE_DELAY_MS);
    }
  };

  const onPointerMove = event => {
    if (
      event.pointerType === "touch" ||
      event.isPrimary === false ||
      focusTimer !== null
    ) {
      return;
    }

    if (idle) {
      idle = false;
      enableGlobalEvents();
    }

    scheduleIdle();
  };

  if (reducedMotion) {
    disableGlobalEvents();
    app.stop?.();

    return {
      focusElement() {},
      dispose() {
        disposed = true;
        clearFocusTimer();
        clearIdleTimer();
        disableGlobalEvents();
      }
    };
  }

  enableGlobalEvents();
  pointerTarget.addEventListener("pointermove", onPointerMove, {passive: true});
  scheduleIdle();

  return {
    focusElement(element) {
      const targetRect = element?.getBoundingClientRect?.();
      const focusPoint = resolveTechnologyFocusPoint({
        canvasRect: canvas.getBoundingClientRect(),
        targetRect
      });

      if (!focusPoint) {
        return;
      }

      clearFocusTimer();
      clearIdleTimer();
      idle = false;
      disableGlobalEvents();
      pointSceneAt(focusPoint);

      focusTimer = setTimer(() => {
        focusTimer = null;
        if (disposed) {
          return;
        }

        enableGlobalEvents();
        scheduleIdle();
      }, TECHNOLOGY_FOCUS_HOLD_MS);
    },

    dispose() {
      disposed = true;
      clearFocusTimer();
      clearIdleTimer();
      pointerTarget.removeEventListener("pointermove", onPointerMove);
      disableGlobalEvents();
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
    focusElement(element) {
      interaction.focusElement(element);
    },
    dispose() {
      interaction.dispose();
      app.dispose?.();
    }
  };
}
