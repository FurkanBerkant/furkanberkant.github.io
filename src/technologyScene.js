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
  const objects =
    typeof app.getAllObjects === "function" ? app.getAllObjects() : [];
  const head = findPart(objects, [/^head$/, /head/, /neck/]);

  const right = {
    upperArm: findPart(objects, [
      /right.*upper.*arm/,
      /upper.*arm.*right/,
      /right.*arm/,
      /arm.*right/
    ]),
    forearm: findPart(objects, [
      /right.*forearm/,
      /forearm.*right/,
      /right.*lower.*arm/,
      /lower.*arm.*right/
    ]),
    hand: findPart(objects, [/right.*hand/, /hand.*right/]),
    finger: findPart(objects, [
      /right.*index/,
      /index.*right/,
      /right.*finger/,
      /finger.*right/
    ])
  };

  const fallback = {
    upperArm: findPart(objects, [/upperarm/, /upper.*arm/, /arm/]),
    forearm: findPart(objects, [/forearm/, /lower.*arm/]),
    hand: findPart(objects, [/^hand$/, /hand/]),
    finger: findPart(objects, [/index.*finger/, /finger.*index/, /finger/])
  };

  const upperArm = right.upperArm || fallback.upperArm;
  const forearm = right.forearm || fallback.forearm;
  const hand = right.hand || fallback.hand;
  const finger = right.finger || fallback.finger;
  const parts = {head, upperArm, forearm, hand, finger};
  const base = Object.fromEntries(
    Object.entries(parts)
      .filter(([, object]) => object?.rotation)
      .map(([key, object]) => [key, copyRotation(object)])
  );

  return {
    ...parts,
    base,
    available: Boolean(upperArm || forearm || hand)
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

  const targetY = Math.min(Math.max(Number(state.targetY ?? 0.5), 0.08), 0.92);
  const vertical = (targetY - 0.5) * 2;

  // The robot faces the viewer, so its right arm is the natural arm for
  // presenting the technology list on the viewer's left.
  setRotation(rig.head, rig.base.head, {
    x: vertical * 0.12,
    y: -0.18,
    z: vertical * 0.025
  });
  setRotation(rig.upperArm, rig.base.upperArm, {
    x: -0.1 + vertical * 0.08,
    y: -0.14,
    z: 0.42 + vertical * 0.22
  });
  setRotation(rig.forearm, rig.base.forearm, {
    x: -0.14 + vertical * 0.08,
    y: -0.08,
    z: 0.32 + vertical * 0.18
  });
  setRotation(rig.hand, rig.base.hand, {
    x: -0.04 + vertical * 0.05,
    y: -0.08,
    z: 0.14 + vertical * 0.08
  });
  setRotation(rig.finger, rig.base.finger, {
    x: -0.22,
    y: -0.02,
    z: 0.03
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
