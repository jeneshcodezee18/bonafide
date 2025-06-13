import { pool } from "../app";

/**
 * Select specific fields from a table (single row)
 */
export async function selectFields<T>(
  table: string,
  fields: string[],
  where: string,
  values: any[]
): Promise<T | null> {
  const query = `SELECT ${fields.join(", ")} FROM ${table} WHERE ${where} LIMIT 1`;
  const result = await pool.query<T>(query, values);
  return result.rows[0] || null;
}

/**
 * Select specific fields from a table (multiple rows)
 */
export async function selectManyFields<T>(
  table: string,
  fields: string[],
  where: string,
  values: any[]
): Promise<T[]> {
  const query = `SELECT ${fields.join(", ")} FROM ${table} WHERE ${where}`;
  const result = await pool.query<T>(query, values);
  return result.rows;
}

/**
 * Insert a row into a table
 */
export async function insertOne<T>(
  table: string,
  fields: string[],
  values: any[]
): Promise<T | null> {
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders}) RETURNING *`;
  const result = await pool.query<T>(query, values);
  return result.rows[0] || null;
}

/**
 * Update a row in a table
 */
export async function updateOne<T>(
  table: string,
  setFields: string[],
  where: string,
  values: any[]
): Promise<T | null> {
  const setClause = setFields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const query = `UPDATE ${table} SET ${setClause} WHERE ${where} RETURNING *`;
  const result = await pool.query<T>(query, values);
  return result.rows[0] || null;
}

/**
 * Delete a row from a table
 */
export async function deleteOne<T>(
  table: string,
  where: string,
  values: any[]
): Promise<T | null> {
  const query = `DELETE FROM ${table} WHERE ${where} RETURNING *`;
  const result = await pool.query<T>(query, values);
  return result.rows[0] || null;
}

/**
 * Custom join/select query
 */
export async function selectJoin<T>(
  query: string,
  values: any[]
): Promise<T[]> {
  const result = await pool.query<T>(query, values);
  return result.rows;
}