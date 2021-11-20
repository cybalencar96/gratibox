import connection from "./connection.js";
import users from "./users.js";
import subscribers from "./subscribers.js";
import deliverInfos from "./deliverInfos.js";
import { signUp } from "../controllers/users.js";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear.js";
dayjs.extend(dayOfYear);

export default function makeDbFactory() {
  function endConnection() {
    connection.end();
  }

  async function clear(tables) {
    let query = "";
    tables.forEach((table) => {
      query += `
                DELETE FROM ${table};
            `;
    });

    await connection.query(query);
  }

  return {
    endConnection,
    clear,
    users,
    subscribers,
    deliverInfos,
  };
}

const TIME_1_DAY = 1000 * 60 * 60 * 24;

setInterval(async () => {
  const allSubscribers = await subscribers.get({ only: true });
  const today = dayjs(Date.now()).dayOfYear();

  const todaysDeliverySubscribers = allSubscribers.filter((subscriber) => {
    return dayjs(subscriber.next_deliver_date * 1000).dayOfYear() === today;
  });

  await Promise.all(
    todaysDeliverySubscribers.map((subscriber) => {
      const todaysDeliverDate = new Date(subscriber.next_deliver_date * 1000);
      const deliverOption = subscriber.deliver_option;
      let nextDeliverDate;

      if (subscriber.subscription_type === "monthly") {
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

      if (subscriber.subscription_type === "weekly") {
        let deliverOptionIsoWeek;
        const todayIsoWeek = dayjs(todaysDeliverDate).isoWeekday();

        if (deliverOption === "monday") deliverOptionIsoWeek = 1;
        if (deliverOption === "wednesday") deliverOptionIsoWeek = 3;
        if (deliverOption === "friday") deliverOptionIsoWeek = 5;

        let count = 0;
        for (let i = todayIsoWeek - 1; i < 20; i++) {
          if (i % 7 === deliverOptionIsoWeek - 1) {
            break;
          }
          count += 1;
        }

        nextDeliverDate =
          dayjs(todaysDeliverDate).valueOf() + TIME_1_DAY * count;
        if (todayIsoWeek === deliverOptionIsoWeek) {
          nextDeliverDate = dayjs(todaysDeliverDate).valueOf() + TIME_1_DAY * 7;
        }
      }

      return connection.query(`
            UPDATE subscribers
            SET next_deliver_date = ${nextDeliverDate / 1000} 
            WHERE id = ${subscriber.id}
            RETURNING *
        `);
    })
  );
}, TIME_1_DAY);
