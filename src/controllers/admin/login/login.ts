import jwt from "jsonwebtoken";
import md5 from "md5";
import { commonController } from "../common/common";
import { deleteOne, insertOne, selectFields, updateOne } from "../../../util/commonQuery";


interface SendData {
    status: number;
    err: number;
    data: object; // More specific type than `object`
    msg: string;
}

export const LOGIN = async function (
  data: { username: string; password: string },
  callback: (result: SendData) => void
) {
  let sendData = commonController.getSendData();
  try {
    // Query user from adminmaster table
    const user = await selectFields<{ adminid: number; adminuname: string }>(
      "adminmaster",
      ["adminid", "adminuname"], // Only select needed fields
      "adminuname = $1 AND adminpassword = $2",
      [data.username, md5(data.password)]
    );

    if (user) {
      const token = jwt.sign(
        { username: user.adminuname, id: user.adminid },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      // Save user_id and token in login_token table
      await insertOne(
        "login_token",
        ["user_id", "token", "created_at"],
        [user.adminid, token, new Date()]
     );

      sendData = commonController.getSuccessSendData({ token }, "Login Successful");
    } else {
      sendData = commonController.getErrorSendData({}, 404, {}, "Invalid username or password.");
    }
  } catch (error) {
    console.error("Error while logging in:", error);
    sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
  }
  callback(sendData);
};

export const LOGOUT = async function (
  data: { token: string },
  callback: (result: SendData) => void
) {
  let sendData = commonController.getSendData();

  try {
    const deleted = await deleteOne(
      "login_token",
      "token = $1",
      [data.token]
    );

    if (deleted) {
      sendData = commonController.getSuccessSendData({}, "Successful logout");
    } else {
      sendData = commonController.getSuccessSendData({}, "Token not found");
      sendData.err = 1;
    }
  } catch (error) {
    console.error("Error while deleting token:", error);
    sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
  }

  callback(sendData);
};

export const CHANGED_PASSWORD = async (data, callback) => {
  let sendData = commonController.getSendData();
  try {
    console.log("Change Password Data:", data);
    const bodyData = data;
    const userData = data.userData;
    const userId = userData.id; // Assuming JWT payload has 'id' as adminid

    // 1. Find user by id
    const user = await selectFields<{ adminid: number; adminpassword: string }>(
      "adminmaster",
      ["adminid", "adminpassword"],
      "adminid = $1",
      [userId]
    );

    if (!user) {
      sendData.status = 401;
      sendData.err = 1;
      sendData.msg = "User Not Exist";
      return callback(sendData);
    }

    // 2. Check old password
    const oldmd5Password = md5(bodyData.oldPassword);
    if (oldmd5Password !== user.adminpassword) {
      sendData = commonController.getErrorSendData(1, 200, {}, "Old password does not match");
      return callback(sendData);
    }

    // 3. Check new and confirm password match
    if (bodyData.newPassword !== bodyData.confirmPassword) {
      sendData = commonController.getErrorSendData({}, 200, {}, "Password and confirm password must be same");
      return callback(sendData);
    }

    // 4. Update password
    const updated = await updateOne(
      "adminmaster",
      ["adminpassword"],
      "adminid = $2",
      [md5(bodyData.confirmPassword), userId]
    );

    if (updated) {
      sendData = commonController.getSuccessSendData({}, "Password Successfully Changed");
    } else {
      sendData = commonController.getErrorSendData({}, 200, {}, "Password not changed");
    }
  } catch (err) {
    console.log("error", err);
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};
