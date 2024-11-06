import { intervalToDuration, formatDuration } from "date-fns";

export function LogTimeDisplay(totalSeconds: number) {
  // Convert total seconds to duration format
  const duration = intervalToDuration({ start: 0, end: totalSeconds * 1000 });

  // Format as "HH:mm:ss"
  const formattedTime = formatDuration(duration, {
    format: ["hours", "minutes", "seconds"],
  });

  return formattedTime;
}
