import { Schedule, Slot, Time } from "./schedule.type";
import { addMinutes, isBetweenHours } from "./time.util";

const schedules: Schedule[] = [
  [
    ["09:00", "11:30"],
    ["13:30", "16:00"],
    ["16:00", "17:30"],
    ["17:45", "19:00"],
  ],
  [
    ["09:15", "12:00"],
    ["14:00", "16:30"],
    ["17:00", "17:30"],
  ],
  [
    ["11:30", "12:15"],
    ["15:00", "16:30"],
    ["17:45", "19:00"],
  ],
];

function getEarliestAvailableTime(
  schedules: Schedule[],
  meetingDurationMinutes: number,
  businessHour: Slot
): Time | null {
  const eachSlots = schedules.flatMap((e) => e);
  const slotCandidatesStartTime = eachSlots
    .map((schedule) => schedule[1])
    .sort((a, b) => a.localeCompare(b, "en-us"));
  const slotCandidates = slotCandidatesStartTime.map(
    (start) => [start, addMinutes(start, meetingDurationMinutes)] as Slot
  );
  const firstAvailableSlot = slotCandidates.find(([cStart, cEnd]) =>
    eachSlots.every(
      ([start, end]) =>
        !isBetweenHours(cStart, start, end) &&
        !isBetweenHours(cEnd, start, end) &&
        isBetweenHours(cStart, ...businessHour) &&
        isBetweenHours(cEnd, ...businessHour)
    )
  );

  return firstAvailableSlot?.[0] ?? null;
}

console.log(getEarliestAvailableTime(schedules, 70, ["09:00", "19:00"]));
