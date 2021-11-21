/* eslint-disable consistent-return */
import makeDbFactory from "../database/database.js";

const db = makeDbFactory();

async function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("missing token");
  }

  try {
    const user = await db.users.get("session", token);
    if (!user) {
      return res.status(401).send("session not exists");
    }

    res.locals.user = user;
    res.locals.token = token;
    next();
  } catch (error) {
    return res.sendStatus(500);
  }
}

export { auth };
