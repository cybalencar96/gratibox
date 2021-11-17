import connection from "./connection.js";

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
    
    const {
        name,
        cep,
        address,
        city,
        uf,
    } = deliverInfos;

    const subscription = await connection.query(`
        INSERT INTO subscribers
            (user_id, subscription_type, deliver_option, teas, incenses, organics)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [userId, subscriptionType, deliverOption, teas, incenses, organics])

    const deliver_infos = await connection.query(`
        INSERT INTO deliver_infos
            (subscriber_id, name, cep, address, city, uf)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `, [subscription.rows[0].id, name, cep, address, city, uf]);

    return {
        subscription: subscription.rows[0],
        deliver_infos: deliver_infos.rows[0]
    }
}

async function get({id, userId}) {
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
    `

    if (id) {
        query += 'AND subscribers.id = $1'
        const result = await connection.query(query + ';', [id])
        return result.rows[0];
    }

    if (userId) {
        query += `AND subscribers.user_id = $1`
        const result = await connection.query(query + ';', [userId])
        return result.rows[0];
    }

    const result = await connection.query(query + ';', params)
    return result.rows;
}

const subscribersFatory = {
    add,
    get,
}

export default subscribersFatory;