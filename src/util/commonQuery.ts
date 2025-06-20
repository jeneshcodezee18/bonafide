import { UUID } from "aws-sdk/clients/cloudtrail";
import { pool } from "../app";
import { QueryResultRow } from "pg";

type SimpleValue = string | number | boolean | null;

type ConditionOperators = {
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

type Condition = SimpleValue | ConditionOperators;
type FilterGroup = Record<string, Condition>;

type FilterInput =
  | FilterGroup // default AND
  | {
      AND?: FilterGroup;
      OR?: FilterGroup;
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
  filters: FilterInput,
  tableName: string,
  dynamicColumns: string[] = []
): Promise<Array<Record<string, any>>> => {
  const values: any[] = [];
  let paramIndex = 1;

  const buildConditions = (group: FilterGroup): string[] => {
    const clauses: string[] = [];

    for (const [key, condition] of Object.entries(group)) {
      if (
        typeof condition !== "object" ||
        condition === null ||
        Array.isArray(condition)
      ) {
        clauses.push(`"${key}" = $${paramIndex}`);
        values.push(condition);
        paramIndex++;
      } else {
        const cond = condition as ConditionOperators;

        if (cond.equalTo !== undefined) {
          clauses.push(`"${key}" = $${paramIndex}`);
          values.push(cond.equalTo);
        } else if (cond.notEqualTo !== undefined) {
          clauses.push(`"${key}" != $${paramIndex}`);
          values.push(cond.notEqualTo);
        } else if (cond.greaterThan !== undefined) {
          clauses.push(`"${key}" > $${paramIndex}`);
          values.push(cond.greaterThan);
        } else if (cond.lessThan !== undefined) {
          clauses.push(`"${key}" < $${paramIndex}`);
          values.push(cond.lessThan);
        } else if (cond.greaterThanOrEqual !== undefined) {
          clauses.push(`"${key}" >= $${paramIndex}`);
          values.push(cond.greaterThanOrEqual);
        } else if (cond.lessThanOrEqual !== undefined) {
          clauses.push(`"${key}" <= $${paramIndex}`);
          values.push(cond.lessThanOrEqual);
        } else if (cond.in !== undefined) {
          clauses.push(`"${key}" = ANY($${paramIndex})`);
          values.push(cond.in);
        } else if (cond.notIn !== undefined) {
          clauses.push(`NOT ("${key}" = ANY($${paramIndex}))`);
          values.push(cond.notIn);
        } else if (cond.like !== undefined) {
          clauses.push(`"${key}" ILIKE $${paramIndex}`);
          values.push(cond.like);
        }
        paramIndex++;
      }
    }

    return clauses;
  };

  let andClauses: string[] = [];
  let orClauses: string[] = [];

  // Handle shorthand: if filters is flat object
  if ("AND" in filters || "OR" in filters) {
    const obj = filters as { AND?: FilterGroup; OR?: FilterGroup };
    andClauses = obj.AND ? buildConditions(obj.AND) : [];
    orClauses = obj.OR ? buildConditions(obj.OR) : [];
  } else {
    andClauses = buildConditions(filters as FilterGroup);
  }

  const whereClauseParts = [];
  if (andClauses.length) {
    whereClauseParts.push(`(${andClauses.join(" AND ")})`);
  }
  if (orClauses.length) {
    whereClauseParts.push(`(${orClauses.join(" OR ")})`);
  }

  const selectColumns =
    dynamicColumns.length > 0
      ? dynamicColumns.map((col) => `"${col}"`).join(", ")
      : "*";

  const queryText = `
    SELECT ${selectColumns} FROM "${tableName}"
    ${whereClauseParts.length ? `WHERE ${whereClauseParts.join(" AND ")}` : ""};
  `;

  const result = await pool.query(queryText, values);
  return result?.rows || [];
};
