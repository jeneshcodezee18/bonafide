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

// interface SendData {
//   status: number;
//   err: number;
//   data: object;
//   msg: string;
// }
export const ADD_PARTNER = async function (
  data: {
    partner_id?: string;
    first_name: string;
    website_url: string;
    brief_introduction: string;
    long_text: string;
    image: string;
    type: number;
    status: string;
  },
  callback: CallbackFunction
) {
  let sendData = commonController.getSendData();
  const bodyData = data;
  console.log("bodyData: ", bodyData);
  console.log("bodyData.type: ", bodyData.type);
  try {
    if (bodyData.partner_id) {
      const partnerId = parseInt(bodyData.partner_id, 10);
      // const existPartner = await selectFields(
      //   "partner_list",
      //   ["partner_id"],
      //   "first_name = $1 AND website_url = $2 AND partner_id != $3",
      //   [bodyData.first_name, bodyData.website_url, partnerId]
      // );

      const existPartner = await selectQuery(
        {
          first_name: bodyData.first_name,
          website_url: bodyData.website_url,
          partner_id: { notEqualTo: partnerId }, // pseudo for "!="
        },
        TABLES.PARTNER_LIST,
        ["partner_id"]
      );

      if (existPartner.length) {
        sendData = commonController.getErrorSendData(
          {},
          200,
          {},
          "Partner already exists."
        );
      } else {
        // const updatedPartner = await updateOne(
        //   "partner_list",
        //   [
        //     "first_name",
        //     "website_url",
        //     "brief_introduction",
        //     "long_text",
        //     "images",
        //     "type",
        //     "status",
        //   ],
        //   "partner_id = $8",
        //   [
        //     bodyData.first_name,
        //     bodyData.website_url,
        //     bodyData.brief_introduction,
        //     bodyData.long_text,
        //     bodyData.image,
        //     Number(bodyData.type),
        //     bodyData.status,
        //     partnerId,
        //   ]
        // );

        const updatedPartner = await updateQuery(
          {
            first_name: bodyData.first_name,
            website_url: bodyData.website_url,
            brief_introduction: bodyData.brief_introduction,
            long_text: bodyData.long_text,
            images: bodyData.image,
            type: Number(bodyData.type),
            status: bodyData.status,
          },
          TABLES.PARTNER_LIST,
          { partner_id: partnerId }
        );

        if (updatedPartner) {
          sendData = commonController.getSuccessSendData(
            updatedPartner,
            "Partner updated successfully"
          );
        } else {
          sendData = commonController.getErrorSendData(
            {},
            400,
            {},
            "Failed to update partner."
          );
        }
      }
    } else {
      // const existPartner = await selectFields(
      //   "partner_list",
      //   ["partner_id"],
      //   "first_name = $1 AND website_url = $2",
      //   [bodyData.first_name, bodyData.website_url]
      // );

      const existPartner = await selectQuery(
        {
          first_name: bodyData.first_name,
          website_url: bodyData.website_url,
        },
        TABLES.PARTNER_LIST,
        ["partner_id"]
      );

      if (existPartner.length) {
        sendData = commonController.getErrorSendData(
          {},
          200,
          {},
          "Partner already exists."
        );
      } else {
        // const addPartner = await insertOne(
        //   "partner_list",
        //   [
        //     "first_name",
        //     "website_url",
        //     "brief_introduction",
        //     "long_text",
        //     "images",
        //     "type",
        //     "status",
        //     "createddate",
        //   ],
        //   [
        //     bodyData.first_name,
        //     bodyData.website_url,
        //     bodyData.brief_introduction,
        //     bodyData.long_text,
        //     bodyData.image,
        //     bodyData.type,
        //     bodyData.status,
        //     new Date(),
        //   ]
        // );

        const addPartner = await insertQuery(
          {
            first_name: bodyData.first_name,
            website_url: bodyData.website_url,
            brief_introduction: bodyData.brief_introduction,
            long_text: bodyData.long_text,
            images: bodyData.image,
            type: bodyData.type,
            status: bodyData.status,
            createddate: new Date(),
          },
          TABLES.PARTNER_LIST
        );

        if (addPartner) {
          sendData = commonController.getSuccessSendData(
            addPartner,
            "Partner added successfully"
          );
        } else {
          sendData = commonController.getErrorSendData(
            {},
            400,
            {},
            "Failed to add partner."
          );
        }
      }
    }
  } catch (error) {
    console.error("Error while adding/updating partner:", error);
    sendData = commonController.getErrorSendData(
      {},
      500,
      {},
      "Internal server error."
    );
  }
  callback(sendData);
};

export const VIEW_PARTNER = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    // const condition = "partner_id = $1";
    // const values = [bodyData.partner_id || bodyData.id];

    // const partner = await selectFields(
    //   "partner_list",
    //   [
    //     "partner_id",
    //     "first_name",
    //     "website_url",
    //     "brief_introduction",
    //     "long_text",
    //     "images",
    //     "type",
    //     "status",
    //     "createddate",
    //   ],
    //   condition,
    //   values
    // );

    const partnerIdValue = bodyData.partner_id || bodyData.id;

    const partner = await selectQuery(
      { partner_id: partnerIdValue },
      TABLES.PARTNER_LIST,
      [
        "partner_id",
        "first_name",
        "website_url",
        "brief_introduction",
        "long_text",
        "images",
        "type",
        "status",
        "createddate",
      ]
    );

    if (partner.length) {
      sendData = commonController.getSuccessSendData(
        partner[0],
        "Partner Found"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        404,
        {},
        "Partner not Found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const DELETE_PARTNER = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    const partnerId = bodyData.partner_id || bodyData.id;

    // const deletedPartner = await deleteOne("partner_list", "partner_id = $1", [
    //   partnerId,
    // ]);

    const deletedPartner = await deleteQuery(
      { partner_id: partnerId },
      TABLES.PARTNER_LIST
    );

    if (deletedPartner) {
      sendData = commonController.getSuccessSendData(
        deletedPartner,
        "Partner Deleted Successfully"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        400,
        {},
        "Partner not Deleted"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_PARTNER = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const start = parseInt(data.start) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (start - 1) * limit;

    const partnerList = await selectJoin(
      `SELECT * FROM ${TABLES.PARTNER_LIST} ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = (await selectJoin(
      `SELECT COUNT(*) as count FROM ${TABLES.PARTNER_LIST}`,
      []
    )) as { count: string }[];

    const total_partners = parseInt(countResult[0]?.count || "0");

    if (partnerList.length > 0) {
      const respData = common.paginationSetup({
        start,
        limit,
        numRows: total_partners,
        currentRows: partnerList as object[],
      });
      respData.list = partnerList as object[];
      sendData["data"] = respData;

      sendData = commonController.getSuccessSendData(
        sendData.data,
        "Partner List Found"
      );
    } else {
      sendData = commonController.getSuccessSendData(
        {},
        "Partner List Does Not Found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};
