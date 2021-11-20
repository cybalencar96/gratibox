import makeDbFactory from "../database/database.js";

const db = makeDbFactory();

async function getDeliverHistory(req, res) {
  try {
    const subscription = await db.subscribers.get({
      userId: res.locals.user.user_id,
    });
    if (!subscription) {
      return res.status(406).send("user not subscribed");
    }

    const deliveries = await db.deliveries.get({
      subscriberId: subscription.id,
    });

    res.send(deliveries);
  } catch (error) {
    console.log(error);

    res.sendStatus(500);
  }
}

async function putDeliverAvaliation(req, res) {
  try {
    const subscriber = await db.subscribers.get({
      userId: res.locals.user.user_id,
    });

    if (!subscriber) {
      return res.status(401).send("user is not subscribed");
    }

    const delivery = await db.deliveries.get({
      id: req.body.deliveryId,
    });

    if (!delivery) {
      return res.status(401).send("delivery id invalid");
    }

    if (delivery.subscriber_id !== subscriber.id) {
      return res
        .status(401)
        .send("this delivery does not belong to this subscriber");
    }

    if (req.body.avaliation === false) {
      if (!req.body.avaliationType || !req.body.avaliationDesc) {
        return res.status(400).send("send type and desc for bad avaliations");
      }
    }

    await db.deliveries.changeAvaliation(req.body);

    res.send();
  } catch (error) {
    console.log(error);

    res.sendStatus(500);
  }
}

export { getDeliverHistory, putDeliverAvaliation };
