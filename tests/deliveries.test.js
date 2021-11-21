import "../src/setup.js";
import supertest from "supertest";
import app from "../src/app.js";
import makeDbFactory from "../src/database/database.js";
import {
  getValidUser,
  getValidDeliverInfos,
  getValidAvaliation,
} from "../src/utils/faker.js";

const db = makeDbFactory();
const validUser = getValidUser();
const validDeliverInfos = getValidDeliverInfos();

afterAll(async () => {
  await db.clear([
    "deliveries",
    "deliver_infos",
    "subscribers",
    "sessions",
    "users",
  ]);

  db.endConnection();
});

describe("DELIVERIES ENTITY", () => {
  let userSubscribed;
  let tokenSubscribed;
  let delivery;
  beforeEach(async () => {
    await db.clear([
      "deliveries",
      "deliver_infos",
      "subscribers",
      "sessions",
      "users",
    ]);

    userSubscribed = await db.users.add(validUser);
    tokenSubscribed = await db.users.createSession(userSubscribed.id);

    const addedSubs = await db.subscribers.add({
      userId: userSubscribed.id,
      subscriptionType: "weekly",
      deliverOption: "monday",
      teas: true,
      incenses: true,
      organics: true,
    });

    await db.deliverInfos.add({
      ...validDeliverInfos,
      subscriberId: addedSubs.id,
    });

    delivery = await db.deliveries.add(addedSubs.id);
  });

  describe("route GET /deliveries", () => {
    test("should return 401 when not token or invaid", async () => {
      const result = await supertest(app).get("/deliveries");

      expect(result.status).toEqual(401);
    });

    test("should return 200 when get deliveries", async () => {
      const result = await supertest(app)
        .get("/deliveries")
        .set("Authorization", `Bearer ${tokenSubscribed}`);

      expect(result.status).toEqual(200);
      expect(result.body.length).toEqual(1);
    });
  });

  describe("route PUT /deliveries", () => {
    test("should return 401 when not token or invaid", async () => {
      const result = await supertest(app).put("/deliveries");

      expect(result.status).toEqual(401);
    });

    test("should return 400 when bad avaliations don't have type or description", async () => {
      const invalidAvaliation = {
        deliveryId: delivery.rows[0].id,
        avaliation: false,
      };
      const result = await supertest(app)
        .put("/deliveries")
        .set("Authorization", `Bearer ${tokenSubscribed}`)
        .send(invalidAvaliation);

      expect(result.status).toEqual(400);
    });

    test("should return 200 when deliverie updated", async () => {
      const validAvaliation = getValidAvaliation(delivery.rows[0].id);
      const result = await supertest(app)
        .put("/deliveries")
        .set("Authorization", `Bearer ${tokenSubscribed}`)
        .send(validAvaliation);

      expect(result.status).toEqual(200);
    });
  });
});
