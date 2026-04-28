import { Prisma } from "@prisma/client";

console.log("==== PRISMA DEBUG START ====");

// Print everything Prisma exports
console.log("Prisma keys:", Object.keys(Prisma));

// Try to access enums
console.log("HolidayType:", Prisma?.HolidayType);
console.log("HolidayAudience:", Prisma?.HolidayAudience);

console.log("==== PRISMA DEBUG END ====");