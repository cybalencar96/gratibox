import connection from "./connection.js";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";

dayjs.extend(isoWeek);
const TIME_1_DAY = 1000 * 60 * 60 * 24;

async function add(subscribeInfos) {
  const {
    userId,
    subscriptionType,
    deliverOption,
    teas = false,
    incenses = false,
    organics = false,
    deliverInfos,
  } = subscribeInfos;

  let subscription = await connection.query(
    `
        INSERT INTO subscribers
            (user_id, subscription_type, deliver_option, teas, incenses, organics)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `,
    [userId, subscriptionType, deliverOption, teas, incenses, organics]
  );

  // in case I'm calling from own app needing only add subscription
  if (!deliverInfos) {
    return subscription.rows[0];
  }

  let nextDeliverDate;
  const createdAt_ms = Number(subscription.rows[0].created_at) * 1000;

  if (subscriptionType === "monthly") {
    const date = new Date(createdAt_ms);
    const askedDayOfNextMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      Number(deliverOption)
    );

    nextDeliverDate = dayjs(askedDayOfNextMonth).valueOf();

    const weekday = dayjs(askedDayOfNextMonth).isoWeekday();
    if (weekday === 6) nextDeliverDate += TIME_1_DAY * 2;
    if (weekday === 7) nextDeliverDate += TIME_1_DAY;
  }

  if (subscriptionType === "weekly") {
    let deliverOptionIsoWeek;
    let createdAtIsoWeek = dayjs(createdAt_ms).isoWeekday();

    if (deliverOption === "monday") deliverOptionIsoWeek = 1;
    if (deliverOption === "wednesday") deliverOptionIsoWeek = 3;
    if (deliverOption === "friday") deliverOptionIsoWeek = 5;

    let count = 0;
    for (let i = createdAtIsoWeek - 1; i < 20; i++) {
      if (i % 7 === deliverOptionIsoWeek - 1) {
        break;
      }
      count += 1;
    }

    nextDeliverDate = dayjs(createdAt_ms).valueOf() + TIME_1_DAY * count;
    if (createdAtIsoWeek === deliverOptionIsoWeek) {
      nextDeliverDate = dayjs(createdAt_ms).valueOf() + TIME_1_DAY * 7;
    }
  }

  subscription = await connection.query(`
    UPDATE subscribers
    SET next_deliver_date = ${nextDeliverDate / 1000} 
    WHERE id = ${subscription.rows[0].id}
    RETURNING *
    `);

  const { name, cep, address, city, uf } = deliverInfos;

  const deliver_infos = await connection.query(
    `
        INSERT INTO deliver_infos
            (subscriber_id, name, cep, address, city, uf)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `,
    [subscription.rows[0].id, name, cep, address, city, uf]
  );

  return {
    subscription: subscription.rows[0],
    deliver_infos: deliver_infos.rows[0],
  };
}

async function get(filters = {}) {
  const { id, userId, only } = filters;

  if (only) {
    return (await connection.query(`SELECT * FROM subscribers;`)).rows;
  }

  const params = [];
  let query = `
        SELECT
            subscribers.*,
            deliver_infos.name,
            deliver_infos.cep,
            deliver_infos.address,
            deliver_infos.city,
            deliver_infos.uf
        FROM subscribers JOIN deliver_infos ON subscribers.id = deliver_infos.subscriber_id
        WHERE 1=1 
    `;

  if (id) {
    query += "AND subscribers.id = $1";
    const result = await connection.query(query + ";", [id]);
    return result.rows[0];
  }

  if (userId) {
    query += `AND subscribers.user_id = $1`;
    const result = await connection.query(query + ";", [userId]);
    return result.rows[0];
  }

  const result = await connection.query(query + ";", params);
  return result.rows;
}

const subscribersFatory = {
  add,
  get,
};

export default subscribersFatory;
