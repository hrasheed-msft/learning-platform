const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.course.count().then(c => {
  console.log("DB connected, courses:", c);
  return p.$disconnect();
}).catch(e => {
  console.error("DB error:", e.message);
  return p.$disconnect();
});
