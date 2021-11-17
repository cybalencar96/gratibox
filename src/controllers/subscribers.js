import makeDbFactory from "../database/database.js";

const db = makeDbFactory();

async function subscribe(req, res) {
    const {
        subscriptionType,
        deliverOption,
    } = req.body
    try {
        const isSubscribed = await db.subscribers.get({ userId: res.locals.user.user_id })

        if (isSubscribed) {
            return res.status(409).send('user is a subscriber')
        }

        if (subscriptionType === 'monthly') {
            if (deliverOption === 'monday' || deliverOption === 'wednesday' || deliverOption === 'friday') {
                return res.status(400).send('deliverOption does not match subscription type')
            }
        }

        if (subscriptionType === 'weekly') {
            if (deliverOption === '1' || deliverOption === '10' || deliverOption === '20') {
                return res.status(400).send('deliverOption does not match subscription type')
            }
        }

        const subscription = await db.subscribers.add({
            ...req.body,
            userId: res.locals.user.user_id
        });
        return res.send(subscription);
    } catch (error) {
        console.error(error)
        res.sendStatus(500);
    }
}

export {
    subscribe,
}