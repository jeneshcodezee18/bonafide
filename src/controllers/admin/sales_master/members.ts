import { commonController } from "../common/common";
import * as common from "../common/common";
import {
  // deleteOne,
  deleteQuery,
  // insertOne,
  insertQuery,
  // selectFields,
  selectJoin,
  selectQuery,
  // updateOne,
  updateQuery,
} from "../../../util/commonQuery";
import { CallbackFunction } from "../../../types/common";
import { TABLES } from "../../../util/constants/table_names";

// ADD OR UPDATE MEMBER
export const ADD_MEMBER = async function (
  data: {
    memberid?: string;
    f_name: string;
    l_name: string;
    email: string;
    image: string;
    mobile_number: string;
    whatsapp_number: string;
    designation: string;
    calendly_url: string;
    linkedin_url: string;
    type: string;
    status: number;
  },
  callback: CallbackFunction
) {
  let sendData = commonController.getSendData();
  const bodyData = data;
  try {
    if (bodyData.memberid) {
      const memberId = parseInt(bodyData.memberid, 10);
      // const existMember = await selectFields(
      //   "member_master",
      //   ["memberid"],
      //   "email = $1 AND memberid != $2",
      //   [bodyData.email, memberId]
      // );

      const existMember = await selectQuery(
        {
          AND: {
            email: bodyData.email,
            memberid: { notEqualTo: memberId },
          },
        },
        TABLES.MEMBER_MASTER,
        ["memberid"]
      );

      if (existMember.length) {
        sendData = commonController.getErrorSendData(
          {},
          200,
          {},
          "Member already exists."
        );
      } else {
        // const updatedMember = await updateOne(
        //   "member_master",
        //   [
        //     "f_name",
        //     "l_name",
        //     "email",
        //     "image",
        //     "mobile_number",
        //     "whatsapp_number",
        //     "designation",
        //     "calendly_url",
        //     "linkedin_url",
        //     "type",
        //     "status",
        //   ],
        //   "memberid = $12",
        //   [
        //     bodyData.f_name,
        //     bodyData.l_name,
        //     bodyData.email,
        //     bodyData.image,
        //     bodyData.mobile_number,
        //     bodyData.whatsapp_number,
        //     bodyData.designation,
        //     bodyData.calendly_url,
        //     bodyData.linkedin_url,
        //     bodyData.type,
        //     bodyData.status,
        //     memberId,
        //   ]
        // );

        const updatedMember = await updateQuery(
          {
            f_name: bodyData.f_name,
            l_name: bodyData.l_name,
            email: bodyData.email,
            image: bodyData.image,
            mobile_number: bodyData.mobile_number,
            whatsapp_number: bodyData.whatsapp_number,
            designation: bodyData.designation,
            calendly_url: bodyData.calendly_url,
            linkedin_url: bodyData.linkedin_url,
            type: bodyData.type,
            status: bodyData.status,
          },
          TABLES.MEMBER_MASTER,
          {
            memberid: memberId,
          }
        );

        if (updatedMember) {
          sendData = commonController.getSuccessSendData(
            updatedMember,
            "Member updated successfully"
          );
        } else {
          sendData = commonController.getErrorSendData(
            {},
            400,
            {},
            "Failed to update member."
          );
        }
      }
    } else {
      // const existMember = await selectFields(
      //   "member_master",
      //   ["memberid"],
      //   "email = $1",
      //   [bodyData.email]
      // );

      const existMember = await selectQuery(
        {
          email: bodyData.email,
        },
        TABLES.MEMBER_MASTER,
        ["memberid"]
      );

      if (existMember.length) {
        sendData = commonController.getErrorSendData(
          {},
          200,
          {},
          "Member already exists."
        );
      } else {
        // const addMember = await insertOne(
        //   "member_master",
        //   [
        //     "f_name",
        //     "l_name",
        //     "email",
        //     "image",
        //     "mobile_number",
        //     "whatsapp_number",
        //     "designation",
        //     "calendly_url",
        //     "linkedin_url",
        //     "type",
        //     "status",
        //     "createddate",
        //   ],
        //   [
        //     bodyData.f_name,
        //     bodyData.l_name,
        //     bodyData.email,
        //     bodyData.image,
        //     bodyData.mobile_number,
        //     bodyData.whatsapp_number,
        //     bodyData.designation,
        //     bodyData.calendly_url,
        //     bodyData.linkedin_url,
        //     bodyData.type,
        //     bodyData.status,
        //     new Date(),
        //   ]
        // );

        const addMember = await insertQuery(
          {
            f_name: bodyData.f_name,
            l_name: bodyData.l_name,
            email: bodyData.email,
            image: bodyData.image,
            mobile_number: bodyData.mobile_number,
            whatsapp_number: bodyData.whatsapp_number,
            designation: bodyData.designation,
            calendly_url: bodyData.calendly_url,
            linkedin_url: bodyData.linkedin_url,
            type: bodyData.type,
            status: bodyData.status,
            createddate: new Date(),
          },
          TABLES.MEMBER_MASTER,
          "*" // or ["memberid"] if specific
        );

        if (addMember) {
          sendData = commonController.getSuccessSendData(
            addMember,
            "Member added successfully"
          );
        } else {
          sendData = commonController.getErrorSendData(
            {},
            400,
            {},
            "Failed to add member."
          );
        }
      }
    }
  } catch (error) {
    console.error("Error while adding/updating member:", error);
    sendData = commonController.getErrorSendData(
      {},
      500,
      {},
      "Internal server error."
    );
  }
  callback(sendData);
};

// VIEW MEMBER
export const VIEW_MEMBER = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    // const condition = "memberid = $1";
    // const values = [bodyData.memberid];

    // const member = await selectFields(
    //   "member_master",
    //   [
    //     "memberid",
    //     "f_name",
    //     "l_name",
    //     "email",
    //     "image",
    //     "mobile_number",
    //     "whatsapp_number",
    //     "designation",
    //     "calendly_url",
    //     "linkedin_url",
    //     "type",
    //     "status",
    //     "createddate",
    //   ],
    //   condition,
    //   values
    // );

    const member = await selectQuery(
      {
        memberid: bodyData.memberid,
      },
      TABLES.MEMBER_MASTER,
      [
        "memberid",
        "f_name",
        "l_name",
        "email",
        "image",
        "mobile_number",
        "whatsapp_number",
        "designation",
        "calendly_url",
        "linkedin_url",
        "type",
        "status",
        "createddate",
      ]
    );

    if (member.length) {
      sendData = commonController.getSuccessSendData(member[0], "Member Found");
    } else {
      sendData = commonController.getErrorSendData(
        {},
        404,
        {},
        "Member not Found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

// DELETE MEMBER
export const DELETE_MEMBER = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    const memberId = bodyData.memberid || bodyData.id;

    // const deletedMember = await deleteOne("member_master", "memberid = $1", [
    //   memberId,
    // ]);

    const deletedMember = await deleteQuery(
      {
        memberid: memberId,
      },
      TABLES.MEMBER_MASTER
    );

    if (deletedMember) {
      sendData = commonController.getSuccessSendData(
        deletedMember,
        "Member Deleted Successfully"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        400,
        {},
        "Member not Deleted"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

// LIST MEMBERS
export const LIST_MEMBERS = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const start = parseInt(data.start) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (start - 1) * limit;

    const memberList = await selectJoin(
      `SELECT * FROM ${TABLES.MEMBER_MASTER} ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = (await selectJoin(
      `SELECT COUNT(*) as count FROM ${TABLES.MEMBER_MASTER}`,
      []
    )) as { count: string }[];

    const total_members = parseInt(countResult[0]?.count || "0");

    if (memberList.length > 0) {
      const respData = common.paginationSetup({
        start,
        limit,
        numRows: total_members,
        currentRows: memberList as object[],
      });
      respData.list = memberList as object[];
      sendData["data"] = respData;

      sendData = commonController.getSuccessSendData(
        sendData.data,
        "Member List Found"
      );
    } else {
      sendData = commonController.getSuccessSendData(
        {},
        "Member List Does Not Found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};
