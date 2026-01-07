import "@testing-library/jest-dom";

jest.mock("@/utils/get-worker", () => ({
  getStopWatchWorker: jest.fn(() => null),
}));

