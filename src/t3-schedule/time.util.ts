import { Time } from "./schedule.type";

export function validateTime(time: any): time is Time {
  if (typeof time !== "string")
    throw new Error(`Time format is invalid: ${time}`);
  const re = /^\d{2}:\d{2}$/;
  if (!time.match(re)) throw new Error(`Time format is invalid: ${time}`);
  const [hoursS, minutesS] = time.split(":");
  const hours = +hoursS;
  const minutes = +minutesS;
  if (hours > 23) throw new Error(`Time format is invalid: ${time}`);
  if (minutes > 59) throw new Error(`Time format is invalid: ${time}`);
  return true;
}

export function timeToMinutes(time: Time): number {
  validateTime(time);
  const [hoursS, minutesS] = time.split(":");
  const hours = +hoursS;
  const minutes = +minutesS;
  return minutes + hours * 60;
}

export function minutesToTime(minutes: number): Time {
  const hours = Math.floor(minutes / 60) % 24;
  const hoursS = `${Math.floor(hours)}`.padStart(2, "0");
  const minutesS = `${minutes % 60}`.padStart(2, "0");
  return `${hoursS}:${minutesS}`;
}

export function addMinutes(time: Time, minutesToAdd: number): Time {
  const currentMinutes = timeToMinutes(time);
  const addedMinutes = currentMinutes + minutesToAdd;
  return minutesToTime(addedMinutes);
}

export function isBetweenHours(
  time: Time,
  startInc: Time,
  endExc: Time
): boolean {
  const timeMinutes = timeToMinutes(time);
  const startIncMinutes = timeToMinutes(startInc);
  const endExcMinutes = timeToMinutes(endExc);
  return startIncMinutes <= timeMinutes && timeMinutes < endExcMinutes;
}
