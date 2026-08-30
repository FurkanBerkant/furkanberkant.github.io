import {
  createTechnologySceneMotion,
  resolveTechnologyPointerTarget
} from "./technologyScene";

const createPointerEvent = (type, properties = {}) => {
  const event = new Event(type, {bubbles: true});
  Object.entries(properties).forEach(([name, value]) => {
    Object.defineProperty(event, name, {value});
  });
  return event;
};

it("maps pointer positions to restrained whole-scene offsets", () => {
  const rect = {left: 20, top: 40, width: 200, height: 100};

  expect(
    resolveTechnologyPointerTarget({clientX: 120, clientY: 90, rect})
  ).toEqual({x: 0, y: 0});
  expect(
    resolveTechnologyPointerTarget({clientX: 20, clientY: 40, rect})
  ).toEqual({x: -10, y: -7});
  expect(
    resolveTechnologyPointerTarget({clientX: 220, clientY: 140, rect})
  ).toEqual({x: 10, y: 7});
  expect(
    resolveTechnologyPointerTarget({clientX: -500, clientY: 900, rect})
  ).toEqual({x: -10, y: 7});
  expect(
    resolveTechnologyPointerTarget({
      clientX: 120,
      clientY: 90,
      rect: {...rect, width: 0}
    })
  ).toEqual({x: 0, y: 0});
});

it("moves only the canvas layer from pointer movement across the viewport", () => {
  const pointerTarget = document.createElement("div");
  const canvas = document.createElement("canvas");
  const getViewportRect = () => ({
    left: 0,
    top: 0,
    width: 100,
    height: 100
  });

  const dispose = createTechnologySceneMotion({
    canvas,
    reducedMotion: false,
    pointerTarget,
    getViewportRect
  });

  pointerTarget.dispatchEvent(
    createPointerEvent("pointermove", {
      clientX: 100,
      clientY: 0,
      pointerType: "mouse",
      isPrimary: true
    })
  );

  expect(canvas.style.getPropertyValue("--technology-scene-x")).toBe("10.00px");
  expect(canvas.style.getPropertyValue("--technology-scene-y")).toBe("-7.00px");

  pointerTarget.dispatchEvent(
    createPointerEvent("mouseout", {relatedTarget: null})
  );

  expect(canvas.style.getPropertyValue("--technology-scene-x")).toBe("0.00px");
  expect(canvas.style.getPropertyValue("--technology-scene-y")).toBe("0.00px");

  dispose();
});

it("ignores touch and non-primary pointers", () => {
  const pointerTarget = document.createElement("div");
  const canvas = document.createElement("canvas");

  const dispose = createTechnologySceneMotion({
    canvas,
    reducedMotion: false,
    pointerTarget,
    getViewportRect: () => ({left: 0, top: 0, width: 100, height: 100})
  });

  pointerTarget.dispatchEvent(
    createPointerEvent("pointermove", {
      clientX: 100,
      clientY: 0,
      pointerType: "touch",
      isPrimary: true
    })
  );
  pointerTarget.dispatchEvent(
    createPointerEvent("pointermove", {
      clientX: 100,
      clientY: 0,
      pointerType: "mouse",
      isPrimary: false
    })
  );

  expect(canvas.style.getPropertyValue("--technology-scene-x")).toBe("0.00px");
  expect(canvas.style.getPropertyValue("--technology-scene-y")).toBe("0.00px");

  dispose();
});

it("keeps the scene neutral and registers no motion listeners with reduced motion", () => {
  const pointerTarget = document.createElement("div");
  const canvas = document.createElement("canvas");
  const addEventListener = jest.spyOn(pointerTarget, "addEventListener");

  const dispose = createTechnologySceneMotion({
    canvas,
    reducedMotion: true,
    pointerTarget,
    getViewportRect: () => ({left: 0, top: 0, width: 100, height: 100})
  });

  pointerTarget.dispatchEvent(
    createPointerEvent("pointermove", {
      clientX: 100,
      clientY: 0,
      pointerType: "mouse",
      isPrimary: true
    })
  );

  expect(addEventListener).not.toHaveBeenCalled();
  expect(canvas.style.getPropertyValue("--technology-scene-x")).toBe("0.00px");
  expect(canvas.style.getPropertyValue("--technology-scene-y")).toBe("0.00px");

  dispose();
});
