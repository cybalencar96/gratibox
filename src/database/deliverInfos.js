import connection from "./connection.js";

async function add(deliverInfos) {
    const {
        subscriberId,
        name,
        city,
        cep,
        address,
        uf,
    } = deliverInfos;

    let query = `
        INSERT INTO deliver_infos (subscriber_id, name, city, cep, address, uf)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `

    const result = await connection.query(query,[subscriberId, name, city, cep, address, uf])
    return result.rows[0];
}

const deliverInfosFactory = {
    add,
}

export default deliverInfosFactory;