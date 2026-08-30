const SPLINE_RUNTIME_URL =
  "https://unpkg.com/@splinetool/runtime@1.12.98/build/runtime.js";
const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

const MAX_SCENE_OFFSET = {x: 10, y: 7};

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

const clampUnit = value => Math.min(Math.max(value, -1), 1);

export const resolveTechnologyPointerTarget = ({clientX, clientY, rect}) => {
  const values = [
    Number(clientX),
    Number(clientY),
    Number(rect?.left),
    Number(rect?.top),
    Number(rect?.width),
    Number(rect?.height)
  ];

  if (
    values.some(value => !Number.isFinite(value)) ||
    values[4] <= 0 ||
    values[5] <= 0
  ) {
    return {x: 0, y: 0};
  }

  const [resolvedClientX, resolvedClientY, left, top, width, height] = values;
  const normalizedX = clampUnit(((resolvedClientX - left) / width - 0.5) * 2);
  const normalizedY = clampUnit(((resolvedClientY - top) / height - 0.5) * 2);

  return {
    x: normalizedX * MAX_SCENE_OFFSET.x,
    y: normalizedY * MAX_SCENE_OFFSET.y
  };
};

const setSceneOffset = (canvas, {x, y}) => {
  canvas.style.setProperty("--technology-scene-x", `${x.toFixed(2)}px`);
  canvas.style.setProperty("--technology-scene-y", `${y.toFixed(2)}px`);
};

export const createTechnologySceneMotion = ({
  canvas,
  reducedMotion,
  pointerTarget = window,
  getViewportRect = () => ({
    left: 0,
    top: 0,
    width: Math.max(window.innerWidth, 1),
    height: Math.max(window.innerHeight, 1)
  })
}) => {
  const neutral = {x: 0, y: 0};
  setSceneOffset(canvas, neutral);

  if (reducedMotion) {
    return () => undefined;
  }

  const onPointerMove = event => {
    if (event.pointerType === "touch" || event.isPrimary === false) {
      return;
    }

    setSceneOffset(
      canvas,
      resolveTechnologyPointerTarget({
        clientX: event.clientX,
        clientY: event.clientY,
        rect: getViewportRect()
      })
    );
  };

  const returnToNeutral = () => setSceneOffset(canvas, neutral);
  const onWindowMouseOut = event => {
    if (!event.relatedTarget) {
      returnToNeutral();
    }
  };

  pointerTarget.addEventListener("pointermove", onPointerMove, {passive: true});
  pointerTarget.addEventListener("blur", returnToNeutral);
  pointerTarget.addEventListener("mouseout", onWindowMouseOut);

  return () => {
    pointerTarget.removeEventListener("pointermove", onPointerMove);
    pointerTarget.removeEventListener("blur", returnToNeutral);
    pointerTarget.removeEventListener("mouseout", onWindowMouseOut);
    returnToNeutral();
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

  const disposeMotion = createTechnologySceneMotion({
    canvas,
    reducedMotion
  });

  if (reducedMotion) {
    app.stop?.();
  }

  onReady?.({motionEnabled: !reducedMotion});

  return {
    dispose() {
      disposeMotion();
      app.dispose?.();
    }
  };
}
