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

function isWithinBusinessHour(meetingSlot: Slot, businessHour: Slot): boolean {
  const [meetingStart, meetingEnd] = meetingSlot;

  if (!isBetweenHours(meetingStart, ...businessHour)) return false;
  if (meetingEnd !== "19:00" && !isBetweenHours(meetingEnd, ...businessHour))
    return false;

  return true;
}

function isAvailableHour(
  meetingSlot: Slot,
  isBusyTimeline: Record<string, boolean>
) {
  const [meetingStart, meetingEnd] = meetingSlot;
  for (
    let currentTime = meetingStart;
    currentTime != meetingEnd;
    currentTime = addMinutes(currentTime, 1)
  ) {
    if (isBusyTimeline[currentTime]) return false;
  }

  return true;
}

function getEarliestAvailableTime(
  schedules: Schedule[],
  meetingDurationMinutes: number,
  businessHour: Slot
): Time | null {
  const workingSlots = schedules.flatMap((e) => e);
  const slotCandidatesStartTime = workingSlots
    .map((schedule) => schedule[1])
    .sort((a, b) => a.localeCompare(b, "en-us"));

  type SlotCandidate = {
    slot: Slot;
    canUse: boolean;
  };

  const slotCandidates: SlotCandidate[] = slotCandidatesStartTime
    .map((start) => {
      const slot: Slot = [start, addMinutes(start, meetingDurationMinutes)];
      const canUse = isWithinBusinessHour(slot, businessHour);
      return {
        slot,
        canUse,
      };
    })
    .filter((e) => e.canUse);

  const isBusyTimeline: Record<Time, boolean> = {};
  for (const [workStart, workEnd] of workingSlots) {
    for (
      let currentTime = workStart;
      currentTime != workEnd;
      currentTime = addMinutes(currentTime, 1)
    ) {
      isBusyTimeline[currentTime] = true;
    }
  }

  for (const { slot } of slotCandidates) {
    if (!isAvailableHour(slot, isBusyTimeline)) continue;
    return slot[0];
  }

  return null;
}

console.log(getEarliestAvailableTime(schedules, 60, ["09:00", "19:00"]));
