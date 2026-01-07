export const getStopWatchWorker = () => {
  try {
    // @ts-expect-error - Vite handles this Worker constructor
    return new Worker(new URL("../components/stop-watch-modal/stop-watch-worker.ts", import.meta.url), {
      type: "module",
    });
  } catch (e) {
    console.error("Failed to create worker", e);
    return null;
  }
};
