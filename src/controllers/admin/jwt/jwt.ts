import { Request } from "express";
import { pool } from "../../../app";
import { commonController } from "../common/common";
import jwt, { JsonWebTokenError, VerifyErrors } from "jsonwebtoken";
import { CallbackFunction } from "../../../types/common";

const jwtKey: string | undefined = process.env.JWT_SECRET_KEY;

export const DECODE = async (req:Request, callback:CallbackFunction) => {
  let sendData = commonController.getSendData(); // response data
  sendData = commonController.getErrorSendData({}, 401, {}, "Token Expired");
  if (!req.cookies.token) {
    sendData = commonController.getErrorSendData(
      {},
      406,
      {},
      "No access token provided"
    );
    return callback(sendData);
  }

  try {
    const token: string = req.cookies.token;
    const decoded = jwt.verify(token, jwtKey as string) as {
      id: number;
      username: string;
    };
    if (decoded && decoded.id) {
      // Query the login_token table in PostgreSQL
      const query = `SELECT * FROM login_token WHERE user_id = $1 AND token = $2 LIMIT 1`;
      const values = [decoded.id, token];
      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        sendData = commonController.getSuccessSendData(decoded, "");
      } else {
        sendData = commonController.getErrorSendData(
          {},
          401,
          {},
          "Access token invalid"
        );
      }
    }
  } catch (err: any) {
    console.error("Error decoding token:", err);

    if (
      err instanceof JsonWebTokenError ||
      (err as VerifyErrors).name === "TokenExpiredError"
    ) {
      sendData = commonController.getErrorSendData(
        {},
        401,
        {},
        "Invalid token"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        500,
        {},
        "Unexpected error"
      );
    }
  }

  callback(sendData);
};
