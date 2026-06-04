/**
 * Formats the current system date into an academic banner string.
 * Example Output: "Monday, May 18th"
 */
export const getDynamicHeaderDate = (): string => {
  const now = new Date();

  // 1. Get the full weekday string (e.g., "Monday")
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });

  // 2. Get the short month abbreviation (e.g., "Jan", "May")
  const monthName = now.toLocaleDateString("en-US", { month: "short" });

  // 3. Get the numeric calendar day string
  const dayNum = now.getDate();

  // 4. Determine the mathematical ordinal suffix (st, nd, rd, th)
  let suffix = "th";
  if (dayNum < 11 || dayNum > 13) {
    switch (dayNum % 10) {
      case 1: suffix = "st"; break;
      case 2: suffix = "nd"; break;
      case 3: suffix = "rd"; break;
    }
  }

  // 5. Build and return the formatted value matching your design blueprint
  return `${dayName}, ${monthName} ${dayNum}${suffix}`;
};

export const getCurrentSystemDay = (): string => {
  return new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();
};