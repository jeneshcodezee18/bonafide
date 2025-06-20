import { commonController } from "../common/common";
import * as common from "../common/common"
import { deleteQuery, insertQuery, selectJoin, selectQuery, updateQuery, } from "../../../util/commonQuery";
import { TABLES } from "../../../util/constants/table_names";
import { CallbackFunction } from "../../../types/common";

export const ADD_EMAIL_PROVIDER = async function (
    data: {
        providerid?: string;
        smtphost: string;
        smtpport: string;
        smtpuname: string;
        smtppass: string;
    },
    callback: CallbackFunction
) {
    let sendData = commonController.getSendData();
    const bodyData = data;
    console.log("bodyData: ", bodyData);
    try {
        if (bodyData.providerid) {
            // Check for existing provider with same smtpuname (excluding current)
            const existProvider = await selectQuery(
                { smtpuname: bodyData.smtpuname, providerid: { notEqualTo: bodyData.providerid } },
                TABLES.SCHEDULED_EMAIL_PROVIDER
            );
            if (existProvider && existProvider.length > 0) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Provider with this SMTP username already exists.");
            } else {
                const updatedProvider = await updateQuery(
                    {
                        smtphost: bodyData.smtphost,
                        smtpport: bodyData.smtpport,
                        smtpuname: bodyData.smtpuname,
                        smtppass: bodyData.smtppass
                    },
                    TABLES.SCHEDULED_EMAIL_PROVIDER,
                    { providerid: bodyData.providerid }
                );
                if (updatedProvider) {
                    sendData = commonController.getSuccessSendData(updatedProvider, "Provider updated successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update provider.");
                }
            }
        } else {
            // Check for existing provider with same smtpuname
            const existProvider = await selectQuery(
                { smtpuname: bodyData.smtpuname },
                TABLES.SCHEDULED_EMAIL_PROVIDER
            );
            if (existProvider && existProvider.length > 0) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Provider with this SMTP username already exists.");
            } else {
                const addProvider = await insertQuery(
                    {
                        smtphost: bodyData.smtphost,
                        smtpport: bodyData.smtpport,
                        smtpuname: bodyData.smtpuname,
                        smtppass: bodyData.smtppass
                    },
                    TABLES.SCHEDULED_EMAIL_PROVIDER,
                );
                if (addProvider) {
                    sendData = commonController.getSuccessSendData(addProvider, "Provider added successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add provider.");
                }
            }
        }
    } catch (error) {
        console.error("Error while adding/updating provider:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

export const VIEW_EMAIL_PROVIDER = async (data: any, callback: CallbackFunction) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const providerid = bodyData.providerid;

        const provider = await selectQuery(
            { providerid },
            TABLES.SCHEDULED_EMAIL_PROVIDER,
            ["providerid", "smtphost", "smtpport", "smtpuname", "smtppass"]
        );

        if (provider) {
            sendData = commonController.getSuccessSendData(provider, "Provider Found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Provider not Found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const DELETE_EMAIL_PROVIDER = async (data: any, callback: CallbackFunction) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const providerid = bodyData.providerid || bodyData.id;

        const deletedProvider = await deleteQuery(
            { providerid },
            TABLES.SCHEDULED_EMAIL_PROVIDER,
        );

        if (deletedProvider) {
            sendData = commonController.getSuccessSendData({}, "Provider Deleted Successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Provider not Deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_EMAIL_PROVIDERS = async (data: any, callback: CallbackFunction) => {
    let sendData = commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        const providerList = await selectJoin(
            `SELECT * FROM scheduled_email_provider ORDER BY providerid DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM scheduled_email_provider`,
            []
        ) as { count: string }[];

        const total_providers = parseInt(countResult[0]?.count || "0");

        if (providerList.length > 0) {
            const respData = common.paginationSetup({
                start,
                limit,
                numRows: total_providers,
                currentRows: providerList as object[],
            });
            respData.list = providerList as object[];
            sendData["data"] = respData;

            sendData = commonController.getSuccessSendData(
                sendData.data,
                "Provider List Found"
            );
        } else {
            sendData = commonController.getSuccessSendData(
                {},
                "Provider List Not Found"
            );
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};