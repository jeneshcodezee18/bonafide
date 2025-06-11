import jwt from "jsonwebtoken";
import md5 from "md5";
import { commonController } from "../common/common";
import { pool } from "../../../app";

interface UserData {
  id: number;
  username: string;
  password: string;
}

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
    const query = `
      SELECT adminid, adminuname, adminpassword
      FROM adminmaster
      WHERE adminuname = $1 AND adminpassword = $2
      LIMIT 1
    `;
    const values = [data.username, md5(data.password)];
    const result = await pool.query<UserData>(query, values);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      const token = jwt.sign(
        { username: user.adminuname, id: user.adminId },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      // Save user_id and token in login_token table
      const insertQuery = `
        INSERT INTO login_token (user_id, token, created_at)
        VALUES ($1, $2, NOW())
      `;
      const insertValues = [user.adminId, token];
      await pool.query(insertQuery, insertValues);

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

// export const LOGOUT = async function (data, callback) {
//     // Send data
//     let sendData = commonController.getSendData(); // response data

//     // Logic
//     try {
//         const result = await loginTokenModel.findOneAndDelete({ token: data.token });

//         if (result) {
//             sendData = commonController.getSuccessSendData( {}, "Successful logout");
//         } else {
//             sendData = commonController.getSuccessSendData( {}, "Token not found");
//             sendData["err"] = 1   
//         }
//     } catch (error) {
//         console.error("Error while deleting token:", error);
//         sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");

//     }
    
//     // Send response
//     callback(sendData);
// };

// export const CHANGED_PASSWORD = async (data, callback) => {
//     let sendData = commonController.getSendData(); // response data
//     try {
//       const bodyData = data.data;
//       const userData = data.userData;
//       const userId = userData._id ? new ObjectId(userData._id) : null;
//       const findUser = await AdminLoginModel.findOne({ _id: userId});
  
//       if (!findUser) {
//         sendData['status'] = 401;
//         sendData['err'] = 1;
//         sendData['msg'] = "User Not Exist";
//         return callback(sendData);
//       }
  
//       const condition = {
//         _id: userId
//       }
  
//       const updatedCondition = {
//         password: md5(bodyData.confirmPassword)
//       }
  
//       const oldmd5Pasword = md5(bodyData.oldPassword);
  
//       if (oldmd5Pasword == findUser.password) {
//         if (bodyData.newPassword === bodyData.confirmPassword) {
  
//           const changePassword = await AdminLoginModel.findOneAndUpdate(condition, updatedCondition, { new: true });
  
//           if (changePassword) {
//             sendData = commonController.getSuccessSendData(changePassword, 'Password Successfully Changed');
//           } else {
//             sendData = commonController.getErrorSendData({}, 200, {}, 'Password not changed');
//           }
//         } else {
//             sendData = commonController.getErrorSendData({}, 200, {}, "Password and confirm password must be same");
//         }
//       }
//       else {
//          sendData = commonController.getErrorSendData(1, 200, {}, "Old password does not match");
//       }
//     } catch (err) {
//       console.log("error", err);
//        sendData = commonController.getErrorSendData(err);
//     }
//     callback(sendData);
// };
