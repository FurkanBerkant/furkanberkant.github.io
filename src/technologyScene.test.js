import {
  createTechnologySceneInteraction,
  resolveTechnologyFocusPoint,
  TECHNOLOGY_FOCUS_HOLD_MS,
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

it("maps a selected technology element to a restrained scene focus point", () => {
  expect(
    resolveTechnologyFocusPoint({
      canvasRect: {left: 600, top: 100, width: 600, height: 500},
      targetRect: {left: 100, top: 200, width: 180, height: 40}
    })
  ).toEqual({
    clientX: 684,
    clientY: 220
  });

  expect(
    resolveTechnologyFocusPoint({
      canvasRect: {left: 600, top: 100, width: 600, height: 500},
      targetRect: {left: 100, top: -1000, width: 180, height: 40}
    })
  ).toEqual({
    clientX: 684,
    clientY: 190
  });
});

it("briefly focuses a selected technology, then resumes global cursor follow", () => {
  jest.useFakeTimers();

  const app = {
    setGlobalEvents: jest.fn(),
    stop: jest.fn()
  };
  const pointerTarget = document.createElement("div");
  const canvas = document.createElement("canvas");
  const target = document.createElement("button");

  canvas.getBoundingClientRect = () => ({
    left: 600,
    top: 100,
    width: 600,
    height: 500,
    right: 1200,
    bottom: 600
  });
  target.getBoundingClientRect = () => ({
    left: 100,
    top: 250,
    width: 180,
    height: 40,
    right: 280,
    bottom: 290
  });

  const interaction = createTechnologySceneInteraction({
    app,
    canvas,
    reducedMotion: false,
    pointerTarget
  });

  expect(app.setGlobalEvents).toHaveBeenLastCalledWith(true);

  interaction.focusElement(target);

  expect(app.setGlobalEvents).toHaveBeenLastCalledWith(false);

  jest.advanceTimersByTime(TECHNOLOGY_FOCUS_HOLD_MS);

  expect(app.setGlobalEvents).toHaveBeenLastCalledWith(true);

  interaction.dispose();
});

it("returns the scene to idle center and wakes on the next pointer movement", () => {
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

  jest.advanceTimersByTime(TECHNOLOGY_IDLE_DELAY_MS);
  expect(app.setGlobalEvents).toHaveBeenLastCalledWith(false);

  pointerTarget.dispatchEvent(
    createPointerEvent({
      clientX: 900,
      clientY: 300,
      pointerType: "mouse",
      isPrimary: true
    })
  );

  expect(app.setGlobalEvents).toHaveBeenLastCalledWith(true);

  interaction.dispose();
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
