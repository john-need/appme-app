export const saveToLocalStorage = <T>(key: string, value: T)=> {
  try {
    const s = JSON.stringify(value);
    localStorage.setItem(key, s);
  } catch (e) {
    // ignore write errors
    // you may want to log to monitoring in real apps
  }
};

export const loadFromLocalStorage = <T>(key: string): T | undefined => {
  try {
    const s = localStorage.getItem(key);
    if (!s) return undefined;
    return JSON.parse(s) as T;
  } catch (e) {
    return undefined;
  }
};

