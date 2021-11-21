import express from "express";
import cors from "cors";
import { signUp, signIn, getUserAuthenticated } from "./controllers/users.js";
import { subscribe, getSubscribe } from "./controllers/subscribers.js";
import { subscribeSchema } from "./schemas/subscribers.js";
import { auth } from "./middlewares/auth.js";
import { signUpSchema } from "./schemas/users.js";
import { validateBody } from "./middlewares/validateRequest.js";
import {
  getDeliverHistory,
  putDeliverAvaliation,
} from "./controllers/deliveries.js";
import { putDeliveryAvaliationSchema } from "./schemas/deliveries.js";
import { clearDb } from "./controllers/setupDb.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

// USERS
app.post("/sign-up", validateBody(signUpSchema), signUp);
app.post("/sign-in", signIn);
app.get("/user", auth, getUserAuthenticated);

// SUBSCRIBERS
app.post("/subscriber", auth, validateBody(subscribeSchema), subscribe);
app.get("/subscriber", auth, getSubscribe);

// DELIVERIES
app.get("/deliveries", auth, getDeliverHistory);
app.put(
  "/deliveries",
  auth,
  validateBody(putDeliveryAvaliationSchema),
  putDeliverAvaliation
);

// SETUP DB TO TESTS E2E
app.get("/setup-test-db", clearDb);

export default app;
