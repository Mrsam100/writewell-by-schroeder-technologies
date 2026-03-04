console.log("1-loading...");
try {
  const { initDb } = await import("./server/db/index");
  console.log("2-initDb loaded:", typeof initDb);
  await initDb();
  console.log("3-DB initialized OK");
} catch(e: any) {
  console.error("CRASH:", e.message);
}
process.exit(0);
