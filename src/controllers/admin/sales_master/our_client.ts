import { commonController } from "../common/common";
import * as common from "../common/common";
import {
  // deleteOne,
  // insertOne,
  // selectFields,
  selectJoin,
  // updateOne,
  // selectManyFields,
  updateQuery,
  insertQuery,
  selectQuery,
  deleteQuery,
} from "../../../util/commonQuery";
import { CallbackFunction } from "../../../types/common";
import { TABLES } from "../../../util/constants/table_names";

export const ADD_CLIENT = async function (
  data: {
    client_masterid?: string;
    image: string;
    postion: string;
    categoryid: number;
    sabcategoryid: number;
    link: string;
  },
  callback: CallbackFunction
) {
  let sendData = commonController.getSendData();
  const bodyData = data;
  try {
    if (bodyData.client_masterid) {
      const clientId = parseInt(bodyData.client_masterid, 10);
      // const updatedClient = await updateOne(
      //   "client_master",
      //   ["image", "postion", "categoryid", "sabcategoryid", "link"],
      //   "client_masterid = $6",
      //   [
      //     bodyData.image,
      //     bodyData.postion,
      //     bodyData.categoryid,
      //     bodyData.sabcategoryid,
      //     bodyData.link,
      //     clientId,
      //   ]
      // );

      const updatedClient = await updateQuery(
        {
          image: bodyData.image,
          postion: bodyData.postion,
          categoryid: bodyData.categoryid,
          sabcategoryid: bodyData.sabcategoryid,
          link: bodyData.link,
        },
        TABLES.CLIENT_MASTER,
        { client_masterid: clientId }
      );

      if (updatedClient) {
        sendData = commonController.getSuccessSendData(
          updatedClient,
          "Client updated successfully"
        );
      } else {
        sendData = commonController.getErrorSendData(
          {},
          400,
          {},
          "Failed to update client."
        );
      }
    } else {
      // const addClient = await insertOne(
      //   "client_master",
      //   [
      //     "image",
      //     "postion",
      //     "categoryid",
      //     "sabcategoryid",
      //     "link",
      //     "createddate",
      //   ],
      //   [
      //     bodyData.image,
      //     bodyData.postion,
      //     bodyData.categoryid,
      //     bodyData.sabcategoryid,
      //     bodyData.link,
      //     new Date(),
      //   ]
      // );

      const addClient = await insertQuery(
        {
          image: bodyData.image,
          postion: bodyData.postion,
          categoryid: bodyData.categoryid,
          sabcategoryid: bodyData.sabcategoryid,
          link: bodyData.link,
          createddate: new Date(),
        },
        TABLES.CLIENT_MASTER
      );
      if (addClient) {
        sendData = commonController.getSuccessSendData(
          addClient,
          "Client added successfully"
        );
      } else {
        sendData = commonController.getErrorSendData(
          {},
          400,
          {},
          "Failed to add client."
        );
      }
    }
  } catch (error) {
    console.error("Error while adding/updating client:", error);
    sendData = commonController.getErrorSendData(
      {},
      500,
      {},
      "Internal server error."
    );
  }
  callback(sendData);
};

export const VIEW_CLIENT = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    // const condition = "client_masterid = $1";
    // const values = [bodyData.client_masterid];

    // const client = await selectFields(
    //   "client_master",
    //   [
    //     "client_masterid",
    //     "image",
    //     "postion",
    //     "categoryid",
    //     "sabcategoryid",
    //     "link",
    //     "createddate",
    //   ],
    //   condition,
    //   values
    // );

    const client = await selectQuery(
      { client_masterid: bodyData.client_masterid },
      TABLES.CLIENT_MASTER,
      [
        "client_masterid",
        "image",
        "postion",
        "categoryid",
        "sabcategoryid",
        "link",
        "createddate",
      ]
    );

    if (client.length) {
      sendData = commonController.getSuccessSendData(client[0], "Client found");
    } else {
      sendData = commonController.getErrorSendData(
        {},
        404,
        {},
        "Client not found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const DELETE_CLIENT = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    const clientId = bodyData.client_masterid || bodyData.id;

    // const deletedClient = await deleteOne(
    //   "client_master",
    //   "client_masterid = $1",
    //   [clientId]
    // );

    const deletedClient = await deleteQuery(
      { client_masterid: clientId },
      TABLES.CLIENT_MASTER
    );

    if (deletedClient) {
      sendData = commonController.getSuccessSendData(
        deletedClient,
        "Client deleted successfully"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        400,
        {},
        "Client not deleted"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_CLIENTS = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const start = parseInt(data.start) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (start - 1) * limit;

    const clientList = await selectJoin(
      `SELECT * FROM ${TABLES.CLIENT_MASTER} ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = (await selectJoin(
      `SELECT COUNT(*) as count FROM ${TABLES.CLIENT_MASTER}`,
      []
    )) as { count: string }[];

    const total_clients = parseInt(countResult[0]?.count || "0");

    if (clientList.length > 0) {
      const respData = common.paginationSetup({
        start,
        limit,
        numRows: total_clients,
        currentRows: clientList as object[],
      });
      respData.list = clientList as object[];
      sendData["data"] = respData;

      sendData = commonController.getSuccessSendData(
        sendData.data,
        "Client list found"
      );
    } else {
      sendData = commonController.getSuccessSendData(
        {},
        "Client list not found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_CATEGORY = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    // const categories = await selectManyFields(
    //   "master_category",
    //   ["categoryid", "categoryname"],
    //   "parent_id = 0",
    //   []
    // );

    const categories = await selectQuery(
      { parent_id: 0 },
      TABLES.MASTER_CATEGORY,
      ["categoryid", "categoryname"]
    );

    if (categories.length) {
      sendData = commonController.getSuccessSendData(
        categories,
        "Category list found"
      );
    } else {
      sendData = commonController.getSuccessSendData([], "No categories found");
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_SUBCATEGORY = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const parentId = data.categoryid;
    if (!parentId) {
      sendData = commonController.getErrorSendData(
        {},
        400,
        {},
        "categoryid (parent_id) is required"
      );
      callback(sendData);
      return;
    }
    // const subcategories = await selectManyFields(
    //   "master_category",
    //   ["categoryid", "categoryname"],
    //   "parent_id = $1",
    //   [parentId]
    // );

    const subcategories = await selectQuery(
      { parent_id: parentId },
      TABLES.MASTER_CATEGORY,
      ["categoryid", "categoryname"]
    );

    if (subcategories.length) {
      sendData = commonController.getSuccessSendData(
        subcategories,
        "Sub-category list found"
      );
    } else {
      sendData = commonController.getSuccessSendData(
        [],
        "No sub-categories found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};
