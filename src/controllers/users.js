import bcrypt from "bcrypt";
import { signUpSchema } from "../schemas/users.js";
import makeDbFactory from "../database/database.js";

const db = makeDbFactory();

async function signUp(req, res) {
  const { email } = req.body;

  try {
    const user = await db.users.get("byEmail", email);
    if (user) {
      return res.status(409).send("email already exists");
    }

    await db.users.add(req.body);

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await db.users.get("byEmail", email);
    if (!user) {
      return res.status(401).send("email not found");
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).send("password incorrect");
    }

    const token = await db.users.createSession(user.id);

    return res.send({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function getUserAuthenticated(req, res) {
  const { user, token } = res.locals;

  return res.send({
    id: user.user_id,
    name: user.name,
    email: user.email,
    token,
  });
}

export { signUp, signIn, getUserAuthenticated };
