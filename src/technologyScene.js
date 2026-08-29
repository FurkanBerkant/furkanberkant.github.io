const SPLINE_RUNTIME_URL =
  "https://unpkg.com/@splinetool/runtime@1.12.98/build/runtime.js";
const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

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

export async function createTechnologyScene({
  canvas,
  container,
  reducedMotion,
  onReady
}) {
  const runtime = await loadSplineRuntime();
  const Application = runtime?.Application;

  if (!Application) {
    throw new Error("Spline runtime could not be loaded.");
  }

  const app = new Application(canvas);
  await app.load(SPLINE_SCENE_URL);

  let frame = null;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  const writeScenePosition = () => {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    container.style.setProperty("--robot-follow-x", currentX.toFixed(4));
    container.style.setProperty("--robot-follow-y", currentY.toFixed(4));

    if (
      !reducedMotion &&
      (Math.abs(targetX - currentX) > 0.002 ||
        Math.abs(targetY - currentY) > 0.002)
    ) {
      frame = window.requestAnimationFrame(writeScenePosition);
    } else {
      frame = null;
    }
  };

  const requestWrite = () => {
    if (reducedMotion || frame !== null) return;
    frame = window.requestAnimationFrame(writeScenePosition);
  };

  const onPointerMove = event => {
    if (reducedMotion) return;
    const rect = container.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1);

    targetX = Math.max(-1, Math.min(1, (x - 0.5) * 2));
    targetY = Math.max(-1, Math.min(1, (y - 0.5) * 2));
    requestWrite();
  };

  const onPointerLeave = () => {
    targetX = 0;
    targetY = 0;
    requestWrite();
  };

  if (!reducedMotion) {
    container.addEventListener("pointermove", onPointerMove, {passive: true});
    container.addEventListener("pointerleave", onPointerLeave);
  } else {
    app.stop?.();
  }

  onReady?.();

  return {
    refresh() {},
    dispose() {
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      container.style.removeProperty("--robot-follow-x");
      container.style.removeProperty("--robot-follow-y");
      app.dispose?.();
    }
  };
}
