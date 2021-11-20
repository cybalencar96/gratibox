import connection from "./connection.js";

async function get(filters = {}) {
  const { id, subscriberId } = filters;

  let query = "SELECT * FROM deliveries WHERE 1=1";
  const params = [];

  if (id) {
    query += `AND id = $1`;
    return (await connection.query(query, [id])).rows[0];
  }

  if (subscriberId) {
    params.push(subscriberId);
    query += ` AND subscriber_id = $${params.length}`;
  }

  const result = await connection.query(query, params);
  return result.rows;
}

async function add(subscriberId) {
  return connection.query(
    `INSERT INTO deliveries (subscriber_id) VALUES $1 RETURNING *`,
    [subscriberId]
  );
}

async function changeAvaliation(delivery) {
  const { deliveryId, avaliation, avaliationType, avaliationDesc } = delivery;

  return connection.query(
    `
        UPDATE deliveries
        SET avaliation = $1, avaliation_type = $2, avaliation_desc = $3
        WHERE id = $4;
    `,
    [avaliation, avaliationType, avaliationDesc, deliveryId]
  );
}

const deliveries = {
  get,
  add,
  changeAvaliation,
};

export default deliveries;
