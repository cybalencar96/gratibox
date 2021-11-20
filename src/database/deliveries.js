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

  query += "ORDER BY delivered_at DESC LIMIT 3";

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

  const params = [deliveryId, avaliation];
  let query = `
        UPDATE deliveries
        SET avaliation = $2
    `;

  if (avaliationType && avaliationDesc) {
    params.push(avaliationType);
    params.push(avaliationDesc);
    query += ", avaliation_type = $3, avaliation_desc = $4 ";
  }

  query += "WHERE id = $1";
  return connection.query(query, params);
}

const deliveries = {
  get,
  add,
  changeAvaliation,
};

export default deliveries;
