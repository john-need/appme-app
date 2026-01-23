const isToday = (date: Date | string) => {
  if (!date) return false;
  const testDate = new Date(date);
  if (testDate.toString() === "Invalid Date") {
    return false;
  }
  const now = new Date();
  const todayString = now.toLocaleDateString("en-CA");
  const testDateString = testDate.toLocaleDateString("en-CA");
  const [nowYear, nowMonth, nowDay] = todayString.split("-").map(Number);
  const [testYear, testMonth, testDay] = testDateString.split("-").map(Number);

  return nowYear === testYear && nowMonth === testMonth && nowDay === testDay;

};

export default isToday;