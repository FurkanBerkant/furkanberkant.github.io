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
    currentX += (targetX - currentX) * 0.085;
    currentY += (targetY - currentY) * 0.085;

    container.style.setProperty(
      "--robot-follow-x",
      `${(currentX * 16).toFixed(2)}px`
    );
    container.style.setProperty(
      "--robot-follow-y",
      `${(currentY * 10).toFixed(2)}px`
    );
    container.style.setProperty(
      "--robot-follow-rotate",
      `${(currentX * 0.7).toFixed(3)}deg`
    );

    if (
      !reducedMotion &&
      (Math.abs(targetX - currentX) > 0.0015 ||
        Math.abs(targetY - currentY) > 0.0015)
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

    const x = event.clientX / Math.max(window.innerWidth, 1);
    const y = event.clientY / Math.max(window.innerHeight, 1);

    targetX = Math.max(-1, Math.min(1, (x - 0.5) * 2));
    targetY = Math.max(-1, Math.min(1, (y - 0.5) * 2));
    requestWrite();
  };

  const resetPointer = () => {
    targetX = 0;
    targetY = 0;
    requestWrite();
  };

  const onWindowMouseOut = event => {
    if (!event.relatedTarget) {
      resetPointer();
    }
  };

  if (!reducedMotion) {
    window.addEventListener("pointermove", onPointerMove, {passive: true});
    window.addEventListener("blur", resetPointer);
    window.addEventListener("mouseout", onWindowMouseOut);
  } else {
    app.stop?.();
  }

  onReady?.();

  return {
    refresh() {},
    dispose() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", resetPointer);
      window.removeEventListener("mouseout", onWindowMouseOut);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      container.style.removeProperty("--robot-follow-x");
      container.style.removeProperty("--robot-follow-y");
      container.style.removeProperty("--robot-follow-rotate");
      app.dispose?.();
    }
  };
}
