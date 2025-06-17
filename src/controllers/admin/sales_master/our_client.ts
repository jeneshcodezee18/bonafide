import { commonController } from "../common/common";
import * as common from "../common/common"
import { deleteOne, insertOne, selectFields, selectJoin, updateOne, selectManyFields } from "../../../util/commonQuery";

interface SendData {
    status: number;
    err: number;
    data: object;
    msg: string;
}

export const ADD_CLIENT = async function (
    data: {
        client_masterid?: string;
        image: string;
        postion: string;
        categoryid: number;
        sabcategoryid: number;
        link: string;
    },
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    const bodyData = data;
    try {
        if (bodyData.client_masterid) {
            const clientId = parseInt(bodyData.client_masterid, 10);
            const updatedClient = await updateOne(
                "client_master",
                ["image", "postion", "categoryid", "sabcategoryid", "link"],
                "client_masterid = $6",
                [
                    bodyData.image,
                    bodyData.postion,
                    bodyData.categoryid,
                    bodyData.sabcategoryid,
                    bodyData.link,
                    clientId
                ]
            );
            if (updatedClient) {
                sendData = commonController.getSuccessSendData(updatedClient, "Client updated successfully");
            } else {
                sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update client.");
            }
        } else {
            const addClient = await insertOne(
                "client_master",
                ["image", "postion", "categoryid", "sabcategoryid", "link", "createddate"],
                [
                    bodyData.image,
                    bodyData.postion,
                    bodyData.categoryid,
                    bodyData.sabcategoryid,
                    bodyData.link,
                    new Date()
                ]
            );
            if (addClient) {
                sendData = commonController.getSuccessSendData(addClient, "Client added successfully");
            } else {
                sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add client.");
            }
        }
    } catch (error) {
        console.error("Error while adding/updating client:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

export const VIEW_CLIENT = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const condition = "client_masterid = $1";
        const values = [bodyData.client_masterid];

        const client = await selectFields(
            "client_master",
            ["client_masterid", "image", "postion", "categoryid", "sabcategoryid", "link", "createddate"],
            condition,
            values
        );

        if (client) {
            sendData = commonController.getSuccessSendData(client, "Client found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Client not found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const DELETE_CLIENT = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const clientId = bodyData.client_masterid || bodyData.id;

        const deletedClient = await deleteOne(
            "client_master",
            "client_masterid = $1",
            [clientId]
        );

        if (deletedClient) {
            sendData = commonController.getSuccessSendData(deletedClient, "Client deleted successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Client not deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_CLIENTS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        const clientList = await selectJoin(
            `SELECT * FROM client_master ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM client_master`,
            []
        ) as { count: string }[];

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

export const LIST_CATEGORY = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const categories = await selectManyFields(
            "master_category",
            [
                "categoryid",
                "categoryname",
            ],
            "parent_id = 0",
            []
        );
        if (categories) {
            sendData = commonController.getSuccessSendData(categories, "Category list found");
        } else {
            sendData = commonController.getSuccessSendData([], "No categories found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_SUBCATEGORY = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const parentId = data.categoryid;
        if (!parentId) {
            sendData = commonController.getErrorSendData({}, 400, {}, "categoryid (parent_id) is required");
            callback(sendData);
            return;
        }
        const subcategories = await selectManyFields(
            "master_category",
            [
                "categoryid",
                "categoryname",
            ],
            "parent_id = $1",
            [parentId]
        );
        if (subcategories) {
            sendData = commonController.getSuccessSendData(subcategories, "Sub-category list found");
        } else {
            sendData = commonController.getSuccessSendData([], "No sub-categories found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};