import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear.js";
import connection from "../database/connection.js";
import makeDbFactory from "../database/database";

const db = makeDbFactory();
const TIME_1_DAY = 1000 * 60 * 60 * 24;
dayjs.extend(dayOfYear);

setInterval(async () => {
  const allSubscribers = await db.subscribers.get({ only: true });
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

  await Promise.all(
    todaysDeliverySubscribers.map((subscriber) => {
      return db.deliveries.add(subscriber.id);
    })
  );
}, TIME_1_DAY);
