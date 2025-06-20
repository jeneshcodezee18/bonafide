import { UUID } from "aws-sdk/clients/cloudtrail";
import { pool } from "../app";
import { QueryResultRow } from "pg";



type SimpleValue = string | number | boolean | null;

type FilterCondition =
  | SimpleValue
  | {
    equalTo?: SimpleValue;
    notEqualTo?: SimpleValue;
    greaterThan?: number;
    lessThan?: number;
    greaterThanOrEqual?: number;
    lessThanOrEqual?: number;
    in?: SimpleValue[];
    notIn?: SimpleValue[];
    like?: string;
  };

/**
 * Select specific fields from a table (single row)
 */
export async function selectFields<T extends QueryResultRow>(
  table: string,
  fields: string[],
  where: string,
  values: any[]
): Promise<T | null> {
  const query = `SELECT ${fields.join(
    ", "
  )} FROM ${table} WHERE ${where} LIMIT 1`;
  const result = await pool.query<T>(query, values);
  return result.rows[0] || null;
}

/**
 * Select specific fields from a table (multiple rows)
 **/
export async function selectManyFields<T extends QueryResultRow>(
  table: string,
  fields: string[],
  where?: string,
  values?: any[]
): Promise<T[]> {
  let query = `SELECT ${fields.join(", ")} FROM ${table}`;
  if (where && where.trim() !== "") {
    query += ` WHERE ${where}`;
  }
  const result = await pool.query<T>(query, values || []);
  return result.rows;
}

/**
 * Insert a row into a table
 */
export async function insertOne<T extends QueryResultRow>(
  table: string,
  fields: string[],
  values: any[]
): Promise<T | null> {
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO ${table} (${fields.join(
    ", "
  )}) VALUES (${placeholders}) RETURNING *`;
  const result = await pool.query<T>(query, values);
  return result.rows[0] || null;
}

/**
 * Update a row in a table
 */
export async function updateOne<T extends QueryResultRow>(
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
export async function deleteOne<T extends QueryResultRow>(
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
export async function selectJoin<T extends QueryResultRow>(
  query: string,
  values: any[]
): Promise<T[]> {
  const result = await pool.query<T>(query, values);
  return result.rows;
}

export const insertQuery = async (
  data: Record<
    string,
    string | number | boolean | string[] | number[] | object | null
  >,
  tableName: string,
  returnCols: [string, ...string[]] | "*" = "*"
): Promise<Record<string, any> | null> => {
  const columns: string[] = [...Object.keys(data)];
  const values: (
    | string
    | number
    | boolean
    | string[]
    | number[]
    | object
    | null
  )[] = [...Object.values(data)];
  const placeholders: string = columns.map((_, i) => `$${i + 1}`).join(", ");

  let queryText: string = `
    INSERT INTO "${tableName}" (${columns.join(", ")})
    VALUES (${placeholders})
  `;

  if (returnCols) {
    if (returnCols === "*") {
      queryText += " RETURNING *";
    } else {
      queryText += ` RETURNING ${returnCols.join(", ")}`;
    }
  }

  const result = await pool.query<QueryResultRow>(queryText, values);

  return result.rows[0] || null;
};

export const bulkInsertQuery = async (
  data: Array<
    Record<
      string,
      string | number | boolean | string[] | number[] | object | null | UUID
    >
  >,
  tableName: string,
  returnCols?: [string, ...string[]] | "*"
): Promise<Array<Record<string, any>> | null> => {
  if (data.length === 0) {
    throw new Error("Data array cannot be empty.");
  }

  if (!data[0]) {
    throw new Error("First data item is undefined.");
  }

  const baseColumns: any[] = [...Object.keys(data[0])];
  const values: any[] = [];

  const valuePlaceholders = data.map((row, rowIndex) => {
    const rowValues = [...baseColumns.slice(0, -2).map((col) => row[col])];
    values.push(...rowValues);

    const offset = rowIndex * baseColumns.length;
    const placeholders = baseColumns.map((_, i) => `$${offset + i + 1}`);
    return `(${placeholders.join(", ")})`;
  });

  let queryText = `
    INSERT INTO "${tableName}" (${baseColumns.join(", ")})
    VALUES ${valuePlaceholders.join(",\n")}
  `;

  if (returnCols) {
    queryText +=
      returnCols === "*"
        ? " RETURNING *"
        : ` RETURNING ${returnCols.join(", ")}`;
  }

  const result = await pool.query<QueryResultRow>(queryText, values);

  return result.rows || null;
};

export const updateQuery = async (
  data: Record<
    string,
    string | number | number[] | boolean | null | string[] | UUID
  >,
  tableName: string,
  where: Record<string, string | number | UUID | boolean>
): Promise<Record<string, any> | null> => {
  const updatePayload = { ...data };
  const updateKeys = Object.keys(updatePayload);
  const whereKeys = Object.keys(where);

  // SET clause
  const setClauses = updateKeys
    .map((key, i) => `"${key}" = $${i + 1}`)
    .join(", ");

  // WHERE clause starts after all set values
  const whereClauses = whereKeys
    .map((key, i) => `"${key}" = $${updateKeys.length + i + 1}`)
    .join(" AND ");

  // Combine values
  const updateValues = [
    ...Object.values(updatePayload),
    ...Object.values(where),
  ];

  const queryText = `
    UPDATE "${tableName}"
    SET ${setClauses}
    WHERE ${whereClauses}
    RETURNING *;
  `;

  const result = await pool.query<QueryResultRow>(queryText, updateValues);

  return result.rows[0] || null;
};

export const deleteQuery = async (
  filters: Record<string, string | number | number[] | boolean | null>,
  tableName: string
): Promise<boolean> => {
  const keys = Object.keys(filters).filter(
    (key) => filters[key] !== null && filters[key] !== undefined
  );

  const whereClauses = keys.map((key, i) => {
    const value = filters[key];
    if (Array.isArray(value)) {
      return `"${key}" = ANY($${i + 1})`;
    }
    return `"${key}" = $${i + 1}`;
  });

  const queryText = `
    DELETE FROM "${tableName}"
    ${whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""};
  `;

  const values = keys.map((key) => filters[key]!);

  const result = await pool.query<QueryResultRow>(queryText, values);

  return result?.rowCount ? true : false;
};


export const selectQuery = async (
  filters: Record<string, FilterCondition>,
  tableName: string,
  dynamicColumns: string[] = []
): Promise<Array<Record<string, any>>> => {
  const whereClauses: string[] = [];
  const values: any[] = [];

  let paramIndex = 1;

  for (const [key, condition] of Object.entries(filters)) {
    if (
      typeof condition !== 'object' ||
      condition === null ||
      Array.isArray(condition)
    ) {
      // Shorthand: treat as equalTo
      whereClauses.push(`"${key}" = $${paramIndex}`);
      values.push(condition);
    } else {
      if (condition.equalTo !== undefined) {
        whereClauses.push(`"${key}" = $${paramIndex}`);
        values.push(condition.equalTo);
      } else if (condition.notEqualTo !== undefined) {
        whereClauses.push(`"${key}" != $${paramIndex}`);
        values.push(condition.notEqualTo);
      } else if (condition.greaterThan !== undefined) {
        whereClauses.push(`"${key}" > $${paramIndex}`);
        values.push(condition.greaterThan);
      } else if (condition.lessThan !== undefined) {
        whereClauses.push(`"${key}" < $${paramIndex}`);
        values.push(condition.lessThan);
      } else if (condition.greaterThanOrEqual !== undefined) {
        whereClauses.push(`"${key}" >= $${paramIndex}`);
        values.push(condition.greaterThanOrEqual);
      } else if (condition.lessThanOrEqual !== undefined) {
        whereClauses.push(`"${key}" <= $${paramIndex}`);
        values.push(condition.lessThanOrEqual);
      } else if (condition.in !== undefined) {
        whereClauses.push(`"${key}" = ANY($${paramIndex})`);
        values.push(condition.in);
      } else if (condition.notIn !== undefined) {
        whereClauses.push(`NOT ("${key}" = ANY($${paramIndex}))`);
        values.push(condition.notIn);
      } else if (condition.like !== undefined) {
        whereClauses.push(`"${key}" ILIKE $${paramIndex}`);
        values.push(condition.like);
      }
    }

    paramIndex++;
  }

  const selectColumns =
    dynamicColumns.length > 0
      ? dynamicColumns.map((col) => `"${col}"`).join(", ")
      : "*";

  const queryText = `
    SELECT ${selectColumns} FROM "${tableName}"
    ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""};
  `;

  const result = await pool.query<QueryResultRow>(queryText, values);
  return result?.rows || [];
};
