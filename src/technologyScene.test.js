import {configureTechnologySceneInteraction} from "./technologyScene";

it("uses Spline global events for the scene's built-in pointer interactions", () => {
  const app = {
    setGlobalEvents: jest.fn(),
    stop: jest.fn()
  };

  configureTechnologySceneInteraction({
    app,
    reducedMotion: false
  });

  expect(app.setGlobalEvents).toHaveBeenCalledWith(true);
  expect(app.stop).not.toHaveBeenCalled();
});

it("disables global Spline interactions when reduced motion is requested", () => {
  const app = {
    setGlobalEvents: jest.fn(),
    stop: jest.fn()
  };

  configureTechnologySceneInteraction({
    app,
    reducedMotion: true
  });

  expect(app.setGlobalEvents).toHaveBeenCalledWith(false);
  expect(app.stop).toHaveBeenCalledTimes(1);
});
