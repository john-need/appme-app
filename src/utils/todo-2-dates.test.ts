import todo2Dates from "./todo-2-dates";
// import isToday from "./is-today";

// jest.mock("./is-today");


const sampleTodo: ToDo = {
  "id": "4114d0b7-1e77-40f3-a438-01edd24cb200",
  "activityId": "14bfa268-c51c-4f50-b114-32c0ddc58331",
  "comment": "test comment",
  "completions": [
    "2026-01-30T10:41:20.410525-05:00"
  ],
  "created": "2026-01-30T15:41:20.410Z",
  "occurrences": ["NEVER"],
  "reminder": 15,
  "text": "patched text",
  "time": "12:00:00",
  "updated": "2026-01-30T21:21:27.089Z",
  "userId": "4eca757b-0448-43b6-a945-9fc4b3beae10",
  "startsOn": "2026-02-01T05:00:00.000Z",
  "endsOn": "2026-02-28T05:00:00.000Z"
};


describe("todo2Dates", () => {
  // const mockIsToday = isToday as jest.MockedFunction<typeof isToday>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a single date correctly", () => {
    const result = todo2Dates(sampleTodo);
    expect(result).toEqual(["2026-02-01"]);
  });

  it("should return a WEEKLY_MONDAY repetition correctly", () => {
    const weeklyMondayTodo = { ...sampleTodo, occurrences: ["WEEKLY_MONDAY"] };
    const result = todo2Dates(weeklyMondayTodo);
    expect(result).toEqual(["2026-02-02", "2026-02-09", "2026-02-16", "2026-02-23"]);
  });

  it("should return a WEEKLY_TUESDAY repetition correctly", () => {
    const weeklyTuesdayTodo = { ...sampleTodo, occurrences: ["WEEKLY_TUESDAY"] };
    const result = todo2Dates(weeklyTuesdayTodo);
    expect(result).toEqual(["2026-02-03", "2026-02-10", "2026-02-17", "2026-02-24"]);
  });

  it("should return a WEEKLY_WEDNESDAY repetition correctly", () => {
    const weeklyWednesdayTodo = { ...sampleTodo, occurrences: ["WEEKLY_WEDNESDAY"] };
    const result = todo2Dates(weeklyWednesdayTodo);
    expect(result).toEqual(["2026-02-04", "2026-02-11", "2026-02-18", "2026-02-25"]);
  });


  it("should return a WEEKLY_THURSDAY repetition correctly", () => {
    const weeklyThursdayTodo = { ...sampleTodo, occurrences: ["WEEKLY_THURSDAY"] };
    const result = todo2Dates(weeklyThursdayTodo);
    expect(result).toEqual(["2026-02-05", "2026-02-12", "2026-02-19", "2026-02-26"]);
  });


  it("should return a WEEKLY_FRIDAY repetition correctly", () => {
    const weeklyFridayTodo = { ...sampleTodo, occurrences: ["WEEKLY_FRIDAY"] };
    const result = todo2Dates(weeklyFridayTodo);
    expect(result).toEqual(["2026-02-06", "2026-02-13", "2026-02-20", "2026-02-27"]);
  });


  it("should return a WEEKLY_SATURDAY repetition correctly", () => {
    const weeklySaturdayTodo = { ...sampleTodo, occurrences: ["WEEKLY_SATURDAY"] };
    const result = todo2Dates(weeklySaturdayTodo);
    expect(result).toEqual(["2026-02-07", "2026-02-14", "2026-02-21", "2026-02-28"]);
  });


  it("should return a WEEKLY_SUNDAY repetition correctly", () => {
    const weeklySundayTodo = { ...sampleTodo, occurrences: ["WEEKLY_SUNDAY"] };
    const result = todo2Dates(weeklySundayTodo);
    expect(result).toEqual(["2026-02-01", "2026-02-08", "2026-02-15", "2026-02-22"]);
  });

  it("should return a WEEKLY_SATURDAY and WEEKLY_SUNDAY repetition correctly", () => {
    const weeklySundayTodo = { ...sampleTodo, occurrences: ["WEEKLY_SATURDAY", "WEEKLY_SUNDAY"] };
    const result = todo2Dates(weeklySundayTodo);
    expect(result).toEqual(["2026-02-01", "2026-02-07", "2026-02-08", "2026-02-14", "2026-02-15", "2026-02-21", "2026-02-22", "2026-02-28"]);
  });

  it("should return a 3 day weekly repetition correctly", () => {
    const weeklySundayTodo = { ...sampleTodo, occurrences: ["WEEKLY_MONDAY", "WEEKLY_WEDNESDAY", "WEEKLY_FRIDAY"] };
    const result = todo2Dates(weeklySundayTodo);
    const answer = [
      "2026-02-02",
      "2026-02-04",
      "2026-02-06",
      "2026-02-09",
      "2026-02-11",
      "2026-02-13",
      "2026-02-16",
      "2026-02-18",
      "2026-02-20",
      "2026-02-23",
      "2026-02-25",
      "2026-02-27"
    ];

    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_1ST_MONDAY repetition correctly", () => {
    const weeklyMondayTodo = { ...sampleTodo,   "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_1ST_MONDAY"] };
    const result = todo2Dates(weeklyMondayTodo);
    const answer = [
      "2026-02-02",
      "2026-03-02",
      "2026-04-06",
      "2026-05-04",
      "2026-06-01",
      "2026-07-06",
      "2026-08-03",
      "2026-09-07",
      "2026-10-05",
      "2026-11-02",
      "2026-12-07"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_1ST_TUESDAY repetition correctly", () => {
    const monthlyTuesdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_1ST_TUESDAY"] };
    const result = todo2Dates(monthlyTuesdayTodo);
    const answer = [
      "2026-02-03",
      "2026-03-03",
      "2026-04-07",
      "2026-05-05",
      "2026-06-02",
      "2026-07-07",
      "2026-08-04",
      "2026-09-01",
      "2026-10-06",
      "2026-11-03",
      "2026-12-01"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_1ST_WEDNESDAY repetition correctly", () => {
    const monthlyWednesdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_1ST_WEDNESDAY"] };
    const result = todo2Dates(monthlyWednesdayTodo);
    const answer = [
      "2026-02-04",
      "2026-03-04",
      "2026-04-01",
      "2026-05-06",
      "2026-06-03",
      "2026-07-01",
      "2026-08-05",
      "2026-09-02",
      "2026-10-07",
      "2026-11-04",
      "2026-12-02"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_1ST_THURSDAY repetition correctly", () => {
    const monthlyThursdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_1ST_THURSDAY"] };
    const result = todo2Dates(monthlyThursdayTodo);
    const answer = [
      "2026-02-05",
      "2026-03-05",
      "2026-04-02",
      "2026-05-07",
      "2026-06-04",
      "2026-07-02",
      "2026-08-06",
      "2026-09-03",
      "2026-10-01",
      "2026-11-05",
      "2026-12-03"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_1ST_FRIDAY repetition correctly", () => {
    const monthlyFridayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_1ST_FRIDAY"] };
    const result = todo2Dates(monthlyFridayTodo);
    const answer = [
      "2026-02-06",
      "2026-03-06",
      "2026-04-03",
      "2026-05-01",
      "2026-06-05",
      "2026-07-03",
      "2026-08-07",
      "2026-09-04",
      "2026-10-02",
      "2026-11-06",
      "2026-12-04"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_1ST_SATURDAY repetition correctly", () => {
    const monthlySaturdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_1ST_SATURDAY"] };
    const result = todo2Dates(monthlySaturdayTodo);
    const answer = [
      "2026-02-07",
      "2026-03-07",
      "2026-04-04",
      "2026-05-02",
      "2026-06-06",
      "2026-07-04",
      "2026-08-01",
      "2026-09-05",
      "2026-10-03",
      "2026-11-07",
      "2026-12-05"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_1ST_SUNDAY repetition correctly", () => {
    const monthlySundayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_1ST_SUNDAY"] };
    const result = todo2Dates(monthlySundayTodo);
    const answer = [
      "2026-02-01",
      "2026-03-01",
      "2026-04-05",
      "2026-05-03",
      "2026-06-07",
      "2026-07-05",
      "2026-08-02",
      "2026-09-06",
      "2026-10-04",
      "2026-11-01",
      "2026-12-06"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_LAST_SUNDAY repetition correctly", () => {
    const monthlyLastSundayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_LAST_SUNDAY"] };
    const result = todo2Dates(monthlyLastSundayTodo);
    const answer = [
      "2026-02-22",
      "2026-03-29",
      "2026-04-26",
      "2026-05-31",
      "2026-06-28",
      "2026-07-26",
      "2026-08-30",
      "2026-09-27",
      "2026-10-25",
      "2026-11-29",
      "2026-12-27"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_LAST_MONDAY repetition correctly", () => {
    const monthlyLastMondayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_LAST_MONDAY"] };
    const result = todo2Dates(monthlyLastMondayTodo);
    const answer = [
      "2026-02-23",
      "2026-03-30",
      "2026-04-27",
      "2026-05-25",
      "2026-06-29",
      "2026-07-27",
      "2026-08-31",
      "2026-09-28",
      "2026-10-26",
      "2026-11-30",
      "2026-12-28"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_LAST_TUESDAY repetition correctly", () => {
    const monthlyLastTuesdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_LAST_TUESDAY"] };
    const result = todo2Dates(monthlyLastTuesdayTodo);
    const answer = [
      "2026-02-24",
      "2026-03-31",
      "2026-04-28",
      "2026-05-26",
      "2026-06-30",
      "2026-07-28",
      "2026-08-25",
      "2026-09-29",
      "2026-10-27",
      "2026-11-24",
      "2026-12-29"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_LAST_WEDNESDAY repetition correctly", () => {
    const monthlyLastWednesdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_LAST_WEDNESDAY"] };
    const result = todo2Dates(monthlyLastWednesdayTodo);
    const answer = [
      "2026-02-25",
      "2026-03-25",
      "2026-04-29",
      "2026-05-27",
      "2026-06-24",
      "2026-07-29",
      "2026-08-26",
      "2026-09-30",
      "2026-10-28",
      "2026-11-25",
      "2026-12-30"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_LAST_THURSDAY repetition correctly", () => {
    const monthlyLastThursdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_LAST_THURSDAY"] };
    const result = todo2Dates(monthlyLastThursdayTodo);
    const answer = [
      "2026-02-26",
      "2026-03-26",
      "2026-04-30",
      "2026-05-28",
      "2026-06-25",
      "2026-07-30",
      "2026-08-27",
      "2026-09-24",
      "2026-10-29",
      "2026-11-26",
      "2026-12-31"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_LAST_FRIDAY repetition correctly", () => {
    const monthlyLastFridayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_LAST_FRIDAY"] };
    const result = todo2Dates(monthlyLastFridayTodo);
    const answer = [
      "2026-02-27",
      "2026-03-27",
      "2026-04-24",
      "2026-05-29",
      "2026-06-26",
      "2026-07-31",
      "2026-08-28",
      "2026-09-25",
      "2026-10-30",
      "2026-11-27",
      "2026-12-25"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_LAST_SATURDAY repetition correctly", () => {
    const monthlyLastSaturdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_LAST_SATURDAY"] };
    const result = todo2Dates(monthlyLastSaturdayTodo);
    const answer = [
      "2026-02-28",
      "2026-03-28",
      "2026-04-25",
      "2026-05-30",
      "2026-06-27",
      "2026-07-25",
      "2026-08-29",
      "2026-09-26",
      "2026-10-31",
      "2026-11-28",
      "2026-12-26"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_2ND_SUNDAY repetition correctly", () => {
    const monthly2ndSundayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_2ND_SUNDAY"] };
    const result = todo2Dates(monthly2ndSundayTodo);
    const answer = [
      "2026-02-08",
      "2026-03-08",
      "2026-04-12",
      "2026-05-10",
      "2026-06-14",
      "2026-07-12",
      "2026-08-09",
      "2026-09-13",
      "2026-10-11",
      "2026-11-08",
      "2026-12-13"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_2ND_MONDAY repetition correctly", () => {
    const monthly2ndMondayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_2ND_MONDAY"] };
    const result = todo2Dates(monthly2ndMondayTodo);
    const answer = [
      "2026-02-09",
      "2026-03-09",
      "2026-04-13",
      "2026-05-11",
      "2026-06-08",
      "2026-07-13",
      "2026-08-10",
      "2026-09-14",
      "2026-10-12",
      "2026-11-09",
      "2026-12-14"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_2ND_TUESDAY repetition correctly", () => {
    const monthly2ndTuesdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_2ND_TUESDAY"] };
    const result = todo2Dates(monthly2ndTuesdayTodo);
    const answer = [
      "2026-02-10",
      "2026-03-10",
      "2026-04-14",
      "2026-05-12",
      "2026-06-09",
      "2026-07-14",
      "2026-08-11",
      "2026-09-08",
      "2026-10-13",
      "2026-11-10",
      "2026-12-08"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_2ND_WEDNESDAY repetition correctly", () => {
    const monthly2ndWednesdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_2ND_WEDNESDAY"] };
    const result = todo2Dates(monthly2ndWednesdayTodo);
    const answer = [
      "2026-02-11",
      "2026-03-11",
      "2026-04-08",
      "2026-05-13",
      "2026-06-10",
      "2026-07-08",
      "2026-08-12",
      "2026-09-09",
      "2026-10-14",
      "2026-11-11",
      "2026-12-09"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_2ND_THURSDAY repetition correctly", () => {
    const monthly2ndThursdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_2ND_THURSDAY"] };
    const result = todo2Dates(monthly2ndThursdayTodo);
    const answer = [
      "2026-02-12",
      "2026-03-12",
      "2026-04-09",
      "2026-05-14",
      "2026-06-11",
      "2026-07-09",
      "2026-08-13",
      "2026-09-10",
      "2026-10-08",
      "2026-11-12",
      "2026-12-10"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_2ND_FRIDAY repetition correctly", () => {
    const monthly2ndFridayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_2ND_FRIDAY"] };
    const result = todo2Dates(monthly2ndFridayTodo);
    const answer = [
      "2026-02-13",
      "2026-03-13",
      "2026-04-10",
      "2026-05-08",
      "2026-06-12",
      "2026-07-10",
      "2026-08-14",
      "2026-09-11",
      "2026-10-09",
      "2026-11-13",
      "2026-12-11"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_2ND_SATURDAY repetition correctly", () => {
    const monthly2ndSaturdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_2ND_SATURDAY"] };
    const result = todo2Dates(monthly2ndSaturdayTodo);
    const answer = [
      "2026-02-14",
      "2026-03-14",
      "2026-04-11",
      "2026-05-09",
      "2026-06-13",
      "2026-07-11",
      "2026-08-08",
      "2026-09-12",
      "2026-10-10",
      "2026-11-14",
      "2026-12-12"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_3RD_SUNDAY repetition correctly", () => {
    const monthly3rdSundayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_3RD_SUNDAY"] };
    const result = todo2Dates(monthly3rdSundayTodo);
    const answer = [
      "2026-02-15",
      "2026-03-15",
      "2026-04-19",
      "2026-05-17",
      "2026-06-21",
      "2026-07-19",
      "2026-08-16",
      "2026-09-20",
      "2026-10-18",
      "2026-11-15",
      "2026-12-20"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_3RD_MONDAY repetition correctly", () => {
    const monthly3rdMondayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_3RD_MONDAY"] };
    const result = todo2Dates(monthly3rdMondayTodo);
    const answer = [
      "2026-02-16",
      "2026-03-16",
      "2026-04-20",
      "2026-05-18",
      "2026-06-15",
      "2026-07-20",
      "2026-08-17",
      "2026-09-21",
      "2026-10-19",
      "2026-11-16",
      "2026-12-21"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_3RD_TUESDAY repetition correctly", () => {
    const monthly3rdTuesdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_3RD_TUESDAY"] };
    const result = todo2Dates(monthly3rdTuesdayTodo);
    const answer = [
      "2026-02-17",
      "2026-03-17",
      "2026-04-21",
      "2026-05-19",
      "2026-06-16",
      "2026-07-21",
      "2026-08-18",
      "2026-09-15",
      "2026-10-20",
      "2026-11-17",
      "2026-12-15"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_3RD_WEDNESDAY repetition correctly", () => {
    const monthly3rdWednesdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_3RD_WEDNESDAY"] };
    const result = todo2Dates(monthly3rdWednesdayTodo);
    const answer = [
      "2026-02-18",
      "2026-03-18",
      "2026-04-15",
      "2026-05-20",
      "2026-06-17",
      "2026-07-15",
      "2026-08-19",
      "2026-09-16",
      "2026-10-21",
      "2026-11-18",
      "2026-12-16"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_3RD_THURSDAY repetition correctly", () => {
    const monthly3rdThursdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_3RD_THURSDAY"] };
    const result = todo2Dates(monthly3rdThursdayTodo);
    const answer = [
      "2026-02-19",
      "2026-03-19",
      "2026-04-16",
      "2026-05-21",
      "2026-06-18",
      "2026-07-16",
      "2026-08-20",
      "2026-09-17",
      "2026-10-15",
      "2026-11-19",
      "2026-12-17"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_3RD_FRIDAY repetition correctly", () => {
    const monthly3rdFridayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_3RD_FRIDAY"] };
    const result = todo2Dates(monthly3rdFridayTodo);
    const answer = [
      "2026-02-20",
      "2026-03-20",
      "2026-04-17",
      "2026-05-15",
      "2026-06-19",
      "2026-07-17",
      "2026-08-21",
      "2026-09-18",
      "2026-10-16",
      "2026-11-20",
      "2026-12-18"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a MONTHLY_3RD_SATURDAY repetition correctly", () => {
    const monthly3rdSaturdayTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_3RD_SATURDAY"] };
    const result = todo2Dates(monthly3rdSaturdayTodo);
    const answer = [
      "2026-02-21",
      "2026-03-21",
      "2026-04-18",
      "2026-05-16",
      "2026-06-20",
      "2026-07-18",
      "2026-08-15",
      "2026-09-19",
      "2026-10-17",
      "2026-11-21",
      "2026-12-19"
    ];
    expect(result).toEqual(answer);
  });

  it("should return a twice monthly repetition correctly", () => {
    const twiceMonthlyTodo = { ...sampleTodo, "endsOn": "2026-12-31T05:00:00.000Z", occurrences: ["MONTHLY_1ST_MONDAY", "MONTHLY_3RD_MONDAY"] };
    const result = todo2Dates(twiceMonthlyTodo);
    const answer = [
      "2026-02-02",
      "2026-02-16",
      "2026-03-02",
      "2026-03-16",
      "2026-04-06",
      "2026-04-20",
      "2026-05-04",
      "2026-05-18",
      "2026-06-01",
      "2026-06-15",
      "2026-07-06",
      "2026-07-20",
      "2026-08-03",
      "2026-08-17",
      "2026-09-07",
      "2026-09-21",
      "2026-10-05",
      "2026-10-19",
      "2026-11-02",
      "2026-11-16",
      "2026-12-07",
      "2026-12-21"
    ];
    expect(result).toEqual(answer);
  });

  it("should return specific dates correctly", () => {
    const specificDatesTodo = { ...sampleTodo, occurrences: ["2026-03-01", "2026-12-12"] };
    const result = todo2Dates(specificDatesTodo);
    const answer = ["2026-03-01", "2026-12-12"];
    expect(result).toEqual(answer);
  });

  it("should return mixed occurrence types correctly", () => {
    const mixedTodo = { ...sampleTodo, occurrences: ["WEEKLY_MONDAY", "2026-02-01", "MONTHLY_LAST_TUESDAY"] };
    const result = todo2Dates(mixedTodo);
    const answer = ["2026-02-01", "2026-02-02", "2026-02-09", "2026-02-16", "2026-02-23", "2026-02-24"];
    expect(result).toEqual(answer);
  });

  it("handles todos with no occurrences", () => {
    const noOccurrencesTodo = { ...sampleTodo, occurrences: [] };
    const result = todo2Dates(noOccurrencesTodo);
    expect(result).toEqual([]);
  });

  it("handles garbage", () => {
    const garbageTodo = { ...sampleTodo, occurrences: ["FOO", 3, {}] };
    // @ts-expect-error - testing garbage input
    const result = todo2Dates(garbageTodo);
    expect(result).toEqual([]);
  });

  it("should return DAILY repetition correctly", () => {
    const dailyTodo = { ...sampleTodo, occurrences: ["DAILY"] };
    const result = todo2Dates(dailyTodo);
    const answer = [
      "2026-02-01", "2026-02-02", "2026-02-03", "2026-02-04", "2026-02-05", "2026-02-06", "2026-02-07",
      "2026-02-08", "2026-02-09", "2026-02-10", "2026-02-11", "2026-02-12", "2026-02-13", "2026-02-14",
      "2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21",
      "2026-02-22", "2026-02-23", "2026-02-24", "2026-02-25", "2026-02-26", "2026-02-27", "2026-02-28"
    ];
    expect(result).toEqual(answer);
  });

  it("should return DAILY repetition for a week correctly", () => {
    const dailyWeekTodo = { ...sampleTodo, endsOn: "2026-02-07T05:00:00.000Z", occurrences: ["DAILY"] };
    const result = todo2Dates(dailyWeekTodo);
    const answer = [
      "2026-02-01", "2026-02-02", "2026-02-03", "2026-02-04", "2026-02-05", "2026-02-06", "2026-02-07"
    ];
    expect(result).toEqual(answer);
  });

  it("should return DAILY repetition for a single day correctly", () => {
    const dailySingleDayTodo = { ...sampleTodo, endsOn: "2026-02-01T05:00:00.000Z", occurrences: ["DAILY"] };
    const result = todo2Dates(dailySingleDayTodo);
    const answer = ["2026-02-01"];
    expect(result).toEqual(answer);
  });

});


