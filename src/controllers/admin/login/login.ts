import jwt from "jsonwebtoken";
import md5 from "md5";
import { commonController } from "../common/common";
import {
  // deleteOne,
  deleteQuery,
  // insertOne,
  insertQuery,
  // selectFields,
  selectQuery,
  // updateOne,
  updateQuery,
} from "../../../util/commonQuery";
import { CallbackFunction } from "../../../types/common";
import { TABLES } from "../../../util/constants/table_names";

export const LOGIN = async function (
  data: { username: string; password: string },
  callback: CallbackFunction
) {
  let sendData = commonController.getSendData();
  try {
    // const user = await selectFields<{
    //   adminid: number;
    //   adminuname: string;
    //   dashboard: string;
    //   report: string;
    //   company_master: string;
    //   khowladge_based: string;
    //   sales_master: string;
    //   services: string;
    //   home_setting: string;
    //   site: string;
    //   carrer_master: string;
    // }>(
    //   "adminmaster",
    //   [
    //     "adminid",
    //     "adminuname",
    //     "dashboard",
    //     "report",
    //     "company_master",
    //     "khowladge_based",
    //     "sales_master",
    //     "services",
    //     "home_setting",
    //     "site",
    //     "carrer_master",
    //   ],
    //   "adminuname = $1 AND adminpassword = $2",
    //   [data.username, md5(data.password)]
    // );

    let user: Record<string, any> = await selectQuery(
      {
        adminuname: data.username,
        adminpassword: md5(data.password),
      },
      TABLES.ADMIN_MASTER,
      [
        "adminid",
        "adminuname",
        "dashboard",
        "report",
        "company_master",
        "khowladge_based",
        "sales_master",
        "services",
        "home_setting",
        "site",
        "carrer_master",
      ]
    );
    user = user.length ? user[0] : {};
    if (user) {
      const tokenPayload = {
        id: user.adminid,
        username: user.adminuname,
        permissions: {
          dashboard: "yes",
          report: user.report,
          company_master: user.company_master,
          khowladge_based: user.khowladge_based,
          sales_master: user.sales_master,
          services: user.services,
          home_setting: user.home_setting,
          site: user.site,
          carrer_master: user.carrer_master,
        },
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      // Save user_id and token in login_token table
      await insertQuery(
        {
          user_id: user.adminid,
          token: token,
          created_at: new Date(),
        },
        TABLES.LOGIN_TOKEN
      );

      sendData = commonController.getSuccessSendData(
        { token },
        "Login Successful"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        404,
        {},
        "Invalid username or password."
      );
    }
  } catch (error) {
    console.error("Error while logging in:", error);
    sendData = commonController.getErrorSendData(
      {},
      500,
      {},
      "Internal server error."
    );
  }
  callback(sendData);
};

export const LOGOUT = async function (
  data: { token: string },
  callback: CallbackFunction
) {
  let sendData = commonController.getSendData();

  try {
    const deleted = await deleteQuery(
      { token: data.token },
      TABLES.LOGIN_TOKEN
    );

    if (deleted) {
      sendData = commonController.getSuccessSendData({}, "Successful logout");
    } else {
      sendData = commonController.getSuccessSendData({}, "Token not found");
      sendData.err = 1;
    }
  } catch (error) {
    console.error("Error while deleting token:", error);
    sendData = commonController.getErrorSendData(
      {},
      500,
      {},
      "Internal server error."
    );
  }

  callback(sendData);
};

export const CHANGED_PASSWORD = async (
  data: Record<string, any>,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    const userData = data.userData;
    const userId = userData.id; // Assuming JWT payload has 'id' as adminid

    // 1. Find user by id
    // const user = await selectFields<{ adminid: number; adminpassword: string }>(
    //   "adminmaster",
    //   ["adminid", "adminpassword"],
    //   "adminid = $1",
    //   [userId]
    // );

    let user: Record<string, any> = await selectQuery(
      { adminid: userId },
      TABLES.ADMIN_MASTER,
      ["adminid", "adminpassword"]
    );

    user = user.length ? user[0] : {};

    if (!user) {
      sendData.status = 401;
      sendData.err = 1;
      sendData.msg = "User Not Exist";
      return callback(sendData);
    }

    // 2. Check old password
    const oldmd5Password = md5(bodyData.oldPassword);
    if (oldmd5Password !== user.adminpassword) {
      sendData = commonController.getErrorSendData(
        1,
        200,
        {},
        "Old password does not match"
      );
      return callback(sendData);
    }

    // 3. Check new and confirm password match
    if (bodyData.newPassword !== bodyData.confirmPassword) {
      sendData = commonController.getErrorSendData(
        {},
        200,
        {},
        "Password and confirm password must be same"
      );
      return callback(sendData);
    }

    // 4. Update password
    // const updated = await updateOne(
    //   "adminmaster",
    //   ["adminpassword"],
    //   "adminid = $2",
    //   [md5(bodyData.confirmPassword), userId]
    // );

    const updated = await updateQuery(
      { adminpassword: md5(bodyData.confirmPassword) },
      TABLES.ADMIN_MASTER,
      { adminid: userId }
    );

    if (updated) {
      sendData = commonController.getSuccessSendData(
        {},
        "Password Successfully Changed"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        200,
        {},
        "Password not changed"
      );
    }
  } catch (err: any) {
    console.log("error", err);
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};
