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

export const configureTechnologySceneInteraction = ({app, reducedMotion}) => {
  app.setGlobalEvents?.(!reducedMotion);

  if (reducedMotion) {
    app.stop?.();
  }
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

  configureTechnologySceneInteraction({app, reducedMotion});

  onReady?.({motionEnabled: !reducedMotion});

  return {
    dispose() {
      app.setGlobalEvents?.(false);
      app.dispose?.();
    }
  };
}
