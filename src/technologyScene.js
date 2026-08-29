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

const normalizeName = value => String(value || "").toLowerCase();

const copyRotation = object => ({
  x: Number(object?.rotation?.x || 0),
  y: Number(object?.rotation?.y || 0),
  z: Number(object?.rotation?.z || 0)
});

const findPart = (objects, patterns) =>
  objects.find(object => {
    const name = normalizeName(object?.name);
    return patterns.some(pattern => pattern.test(name));
  });

const discoverPresenterRig = app => {
  const objects = typeof app.getAllObjects === "function" ? app.getAllObjects() : [];
  const head = findPart(objects, [/^head$/, /head/, /neck/]);
  const upperArm = findPart(objects, [
    /left.*upper.*arm/,
    /upper.*arm.*left/,
    /left.*arm/,
    /arm.*left/,
    /upperarm/
  ]);
  const forearm = findPart(objects, [
    /left.*forearm/,
    /forearm.*left/,
    /left.*lower.*arm/,
    /lower.*arm.*left/,
    /forearm/
  ]);
  const hand = findPart(objects, [/left.*hand/, /hand.*left/, /^hand$/, /hand/]);
  const finger = findPart(objects, [
    /left.*index/,
    /index.*left/,
    /index.*finger/,
    /finger.*index/,
    /finger/
  ]);

  const parts = {head, upperArm, forearm, hand, finger};
  const base = Object.fromEntries(
    Object.entries(parts)
      .filter(([, object]) => object?.rotation)
      .map(([key, object]) => [key, copyRotation(object)])
  );

  return {
    ...parts,
    base,
    available: Boolean(upperArm || forearm || hand || finger)
  };
};

const setRotation = (object, base, delta) => {
  if (!object?.rotation || !base) return;
  object.rotation.x = base.x + (delta.x || 0);
  object.rotation.y = base.y + (delta.y || 0);
  object.rotation.z = base.z + (delta.z || 0);
};

const applyPresenterGesture = (rig, state, reducedMotion) => {
  if (!rig || reducedMotion) return;

  const groupProgress =
    state.groupCount > 1 ? state.groupIndex / (state.groupCount - 1) : 0.5;
  const toolProgress =
    state.technologyCount > 1
      ? state.technologyIndex / (state.technologyCount - 1)
      : 0.5;
  const vertical = (groupProgress * 0.8 + toolProgress * 0.2 - 0.5) * 2;

  setRotation(rig.head, rig.base.head, {
    x: vertical * 0.055,
    y: -0.08
  });
  setRotation(rig.upperArm, rig.base.upperArm, {
    x: -0.05,
    y: -0.08,
    z: 0.16 + vertical * 0.1
  });
  setRotation(rig.forearm, rig.base.forearm, {
    x: -0.08,
    y: -0.04,
    z: 0.18 + vertical * 0.08
  });
  setRotation(rig.hand, rig.base.hand, {
    x: 0.02,
    y: -0.06,
    z: 0.08 + vertical * 0.04
  });
  setRotation(rig.finger, rig.base.finger, {
    x: -0.08,
    z: 0.04
  });
};

export async function createTechnologyScene({
  canvas,
  stateRef,
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

  const rig = discoverPresenterRig(app);
  const refresh = () => {
    applyPresenterGesture(rig, stateRef.current, reducedMotion);
  };

  refresh();

  if (reducedMotion) {
    app.stop?.();
  }

  onReady?.({gestureAvailable: rig.available});

  return {
    refresh,
    dispose() {
      app.dispose?.();
    }
  };
}
