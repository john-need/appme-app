const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};


export default formatTime;