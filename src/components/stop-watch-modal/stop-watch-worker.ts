let timer: NodeJS.Timeout | null = null;
let seconds = 0;

self.onmessage = (e: MessageEvent) => {
  const { command } = e.data;

  if (command === "start") {
    if (!timer) {
      timer = setInterval(() => {
        seconds++;
        self.postMessage({ type: "tick", seconds });
      }, 1000);
    }
  } else if (command === "pause") {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  } else if (command === "reset") {
    seconds = 0;
    self.postMessage({ type: "tick", seconds });
  } else if (command === "set") {
      seconds = e.data.seconds;
      self.postMessage({ type: "tick", seconds });
  }
};
