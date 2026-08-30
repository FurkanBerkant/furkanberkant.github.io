import {
  createTechnologySceneInteraction,
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
