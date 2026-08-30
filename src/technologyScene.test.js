import {
  createTechnologyPresentationController,
  createTechnologySceneInteraction,
  resolvePalmClientPoint,
  resolveTechnologyCenterPoint,
  TECHNOLOGY_IDLE_DELAY_MS
} from "./technologyScene";

const createPointerEvent = properties => {
  const event = new Event("pointermove", {bubbles: true});
  Object.entries(properties).forEach(([name, value]) => {
    Object.defineProperty(event, name, {value});
  });
  return event;
};

afterEach(() => {
  jest.useRealTimers();
});

it("resolves the scene center for idle positioning", () => {
  expect(
    resolveTechnologyCenterPoint({
      left: 600,
      top: 100,
      width: 600,
      height: 500
    })
  ).toEqual({
    clientX: 900,
    clientY: 350
  });

  expect(
    resolveTechnologyCenterPoint({
      left: 0,
      top: 0,
      width: 0,
      height: 500
    })
  ).toBeNull();
});

it("maps the animated palm anchor into browser coordinates", () => {
  expect(
    resolvePalmClientPoint({
      normalizedX: 0.75,
      normalizedY: 0.6,
      rect: {left: 100, top: 50, width: 800, height: 600}
    })
  ).toEqual({clientX: 700, clientY: 410, inView: true});

  expect(
    resolvePalmClientPoint({
      normalizedX: 1.2,
      normalizedY: 0.5,
      rect: {left: 0, top: 0, width: 800, height: 600}
    })
  ).toEqual({clientX: 960, clientY: 300, inView: false});
});

it("keeps Spline global follow enabled while the idle timer runs", () => {
  jest.useFakeTimers();

  const app = {
    setGlobalEvents: jest.fn(),
    stop: jest.fn()
  };
  const pointerTarget = document.createElement("div");
  const canvas = document.createElement("canvas");

  canvas.getBoundingClientRect = () => ({
    left: 600,
    top: 100,
    width: 600,
    height: 500,
    right: 1200,
    bottom: 600
  });

  const interaction = createTechnologySceneInteraction({
    app,
    canvas,
    reducedMotion: false,
    pointerTarget
  });

  expect(app.setGlobalEvents).toHaveBeenCalledTimes(1);
  expect(app.setGlobalEvents).toHaveBeenLastCalledWith(true);

  pointerTarget.dispatchEvent(
    createPointerEvent({
      clientX: 100,
      clientY: 100,
      pointerType: "mouse",
      isPrimary: true
    })
  );

  jest.advanceTimersByTime(TECHNOLOGY_IDLE_DELAY_MS);

  expect(app.setGlobalEvents).toHaveBeenCalledTimes(1);
  expect(app.setGlobalEvents).toHaveBeenLastCalledWith(true);

  interaction.dispose();

  expect(app.setGlobalEvents).toHaveBeenLastCalledWith(false);
});

it("keeps all scene interactions disabled with reduced motion", () => {
  const app = {
    setGlobalEvents: jest.fn(),
    stop: jest.fn()
  };
  const pointerTarget = document.createElement("div");
  const addEventListener = jest.spyOn(pointerTarget, "addEventListener");
  const canvas = document.createElement("canvas");

  const interaction = createTechnologySceneInteraction({
    app,
    canvas,
    reducedMotion: true,
    pointerTarget
  });

  expect(app.setGlobalEvents).toHaveBeenCalledWith(false);
  expect(app.stop).toHaveBeenCalledTimes(1);
  expect(addEventListener).not.toHaveBeenCalled();

  interaction.dispose();
});

it("moves both arms only when presentation mode changes", () => {
  const arm = {
    name: "arm",
    emitEvent: jest.fn(),
    emitEventReverse: jest.fn()
  };
  const head = {
    name: "Head",
    emitEvent: jest.fn(),
    emitEventReverse: jest.fn()
  };
  const app = {
    getSplineEvents: () => ({start: {arm: {}, head: {}}}),
    findObjectById: id => ({arm, head}[id])
  };
  const projection = {
    available: true,
    setPresentation: jest.fn(),
    dispose: jest.fn()
  };
  const controller = createTechnologyPresentationController({
    app,
    projection,
    reducedMotion: false
  });

  expect(arm.emitEventReverse).toHaveBeenCalledTimes(1);
  expect(head.emitEventReverse).not.toHaveBeenCalled();

  controller.setPresentation({visible: true, technology: {name: "Java"}});
  controller.setPresentation({
    visible: true,
    technology: {name: "Spring Boot"}
  });

  expect(arm.emitEvent).toHaveBeenCalledTimes(1);
  expect(projection.setPresentation).toHaveBeenCalledTimes(2);

  controller.setPresentation({visible: false});
  expect(arm.emitEventReverse).toHaveBeenCalledTimes(2);

  controller.dispose();
  expect(projection.dispose).toHaveBeenCalledTimes(1);
});
