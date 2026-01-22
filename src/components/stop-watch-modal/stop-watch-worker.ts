let timer: NodeJS.Timeout | null = null;
let seconds = 0;
let startTime: number | null = null;

self.onmessage = (e: MessageEvent) => {
  const { command } = e.data;

  if (command === "start") {
    if (!timer) {
      startTime = Date.now();
      timer = setInterval(() => {
        const now = Date.now();
        if (startTime && Math.floor((now - startTime) / 1000) - seconds >= 60) {
            seconds = Math.floor((now - startTime) / 1000);
        }
        seconds++;
        self.postMessage({ type: "tick", seconds });
      }, 1000);
    }
  } else if (command === "pause") {
    if (timer) {
      startTime = Date.now();
      clearInterval(timer);
      timer = null;
    }
  } else if (command === "reset") {
    startTime = null;
    seconds = 0;
    self.postMessage({ type: "tick", seconds });
  } else if (command === "set") {
    startTime = Date.now();
    seconds = e.data.seconds;
    self.postMessage({ type: "tick", seconds });
  }
};
