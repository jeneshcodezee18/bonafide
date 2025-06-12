import { pool } from "../../../app";
import { commonController } from "../common/common";
import jwt, { JsonWebTokenError, VerifyErrors } from 'jsonwebtoken';

const jwtKey: string | undefined = process.env.JWT_SECRET_KEY;

export const DECODE = async (req, callback) => {
    let sendData = commonController.getSendData(); // response data
    sendData = commonController.getErrorSendData({}, 401, {}, "Token Expired");

    if (!req.headers.authorization) {
        sendData = commonController.getErrorSendData({}, 406, {}, "No access token provided");
        return callback(sendData);
    }

    try {
        const token: string = req.headers.authorization.split(' ')[1];
        const decoded: { id: number, username: string } = jwt.verify(token, jwtKey as string);
        if (decoded && decoded.id) {
            // Query the login_token table in PostgreSQL
            const query = `SELECT * FROM login_token WHERE user_id = $1 AND token = $2 LIMIT 1`;
            const values = [decoded.id, token];
            const result = await pool.query(query, values);

            if (result.rows.length > 0) {
                sendData = commonController.getSuccessSendData(decoded, "");
            } else {
                sendData = commonController.getErrorSendData({}, 401, {}, "Access token invalid");
            }
        }
    } catch (err) {
        console.error('Error decoding token:', err);

        if (err instanceof JsonWebTokenError || (err as VerifyErrors).name === 'TokenExpiredError') {
            sendData = commonController.getErrorSendData({}, 401, {}, "Invalid token");
        } else {
            sendData = commonController.getErrorSendData({}, 500, {}, "Unexpected error");
        }
    }

    callback(sendData);
};

