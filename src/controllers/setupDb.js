import makeDbFactory from "../database/database.js";

const db = makeDbFactory();

async function clearDb(req, res) {
  if (process.env.NODE_ENV !== "test") {
    res.status(401).send("app must point to test database");
  }

  try {
    await db.clear([
      "deliveries",
      "deliver_infos",
      "subscribers",
      "sessions",
      "users",
    ]);

    res.send();
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export { clearDb };
