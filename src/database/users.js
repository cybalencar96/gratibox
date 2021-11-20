import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import connection from "./connection.js";

async function add(userInfo) {
  const { name, email, password } = userInfo;

  const hash = bcrypt.hashSync(password, 10);

  const userAdded = await connection.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, hash]
  );

  return userAdded.rows[0];
}

async function get(getType, userData) {
  if (getType === "byEmail") {
    const result = await connection.query(
      "SELECT * FROM users WHERE email = $1",
      [userData]
    );

    return result.rows[0];
  }

  if (getType === "byId") {
    const result = await connection.query("SELECT * FROM users WHERE id = $1", [
      userData,
    ]);

    return result.rows[0];
  }

  if (getType === "session") {
    const result = await connection.query(
      `SELECT 
                sessions.user_id,
                users.email 
             FROM sessions 
             JOIN users 
                ON sessions.user_id = users.id 
            WHERE sessions.token = $1
            `,
      [userData]
    );

    return result.rows[0];
  }

  return null;
}

async function createSession(userId) {
  const token = uuid();

  await connection.query(
    "INSERT INTO sessions (token, user_id) VALUES ($1,$2)",
    [token, userId]
  );

  return token;
}

async function removeSessions(removeType, removeData) {
  if (removeType === "byToken") {
    await connection.query("DELETE FROM sessions WHERE token = $1", [
      removeData,
    ]);
  }
}

const usersFactory = {
  add,
  removeSessions,
  createSession,
  get,
};

export default usersFactory;
