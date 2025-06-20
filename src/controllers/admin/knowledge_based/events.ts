import { deleteOne, insertOne, selectFields, selectJoin, updateOne } from "../../../util/commonQuery";
import * as common from "../common/common"
import { commonController } from "../common/common";

interface SendData {
    status: number;
    err: number;
    data: object; // More specific type than `object`
    msg: string;
}

export const ADD_EVENTS = async function (
        data: {
        infographic_and_did_you_know_imagesid?: string; // _id exists or not
        image: string;
        report_title: string;
        createddate: string;
        parent_id?: string;
    },
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    const bodyData = data;
    try {
        // _id exists or not (using infographic_and_did_you_know_imagesid)
        if (bodyData.infographic_and_did_you_know_imagesid) {
            const eventsId = parseInt(bodyData.infographic_and_did_you_know_imagesid, 10);
            const existEvents: any = await selectFields(
                "infographic_and_did_you_know_images",
                ["infographic_and_did_you_know_imagesid"],
                "report_title = $1 AND infographic_and_did_you_know_imagesid != $2",
                [bodyData.report_title, eventsId]
            );
            if (existEvents) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Title already exists.");
            } else {
                // updatedEvents was updated or not
                const updatedEvents = await updateOne(
                    "infographic_and_did_you_know_images",
                    ["image", "report_title", "createddate"],
                    "infographic_and_did_you_know_imagesid = $4",
                    [
                        bodyData.image,
                        bodyData.report_title,
                        bodyData.createddate,
                        eventsId // use the parsed integer here
                    ]
                );
                if (updatedEvents) {
                    sendData = commonController.getSuccessSendData(updatedEvents, "Events updated successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update Events.");
                }
            }
        } else {
            // existEvents already exists or not
            const existEvents: any = await selectFields(
                "infographic_and_did_you_know_images",
                ["infographic_and_did_you_know_imagesid"],
                "report_title = $1",
                [bodyData.report_title]
            );
            if (existEvents) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Title already exists.");
            } else {
                // addEvents was added or not
                const addEvents = await insertOne(
                    "infographic_and_did_you_know_images",
                    [
                        "image",
                        "report_title",
                        "createddate",
                        "type"
                    ],
                    [
                        bodyData.image,
                        bodyData.report_title,
                        bodyData.createddate,
                        "events"
                    ]
                );
                if (addEvents) {
                    sendData = commonController.getSuccessSendData(addEvents, "Events added successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add Events.");
                }
            }
        }
    } catch (error) {
        // Exception occurred or not (catch)
        console.error("Error while adding/updating Events:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

export const VIEW_EVENTS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const condition = "infographic_and_did_you_know_imagesid = $1";
        const values = [bodyData.id];

        const events = await selectFields(
            "infographic_and_did_you_know_images",
            ["infographic_and_did_you_know_imagesid", "image", "report_title", "createddate"],
            condition,
            values
        );

        if (events) {
            sendData = commonController.getSuccessSendData(events, "Events Found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Events not Found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const DELETE_EVENTS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const eventsId = bodyData.id;

        const deletedEvents = await deleteOne(
            "infographic_and_did_you_know_images",
            "infographic_and_did_you_know_imagesid = $1",
            [eventsId]
        );

        if (deletedEvents) {
            sendData = commonController.getSuccessSendData(deletedEvents, "Events Deleted Successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Events not Deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_EVENTS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = common.commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        const didYoyKnowAboutList = await selectJoin(
            `SELECT * FROM infographic_and_did_you_know_images WHERE type = 'events' ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM infographic_and_did_you_know_images WHERE type = 'events'`,
            []
        ) as { count: string }[];

        const total_events = parseInt(countResult[0]?.count || "0");

        if (didYoyKnowAboutList.length > 0) {
            const allowedKeys = ["infographic_and_did_you_know_imagesid","image", "report_title", "createddate"];

            // ✅ Use safe key check
            const filteredList = didYoyKnowAboutList.map((item: any) => {
                const filtered: any = {};
                allowedKeys.forEach((key) => {
                    if (item[key] !== undefined) {
                        filtered[key] = item[key];
                    }
                });
                return filtered;
            });

            const respData = common.paginationSetup({
                start,
                limit,
                numRows: total_events,
                currentRows: filteredList,
            });

            respData.list = filteredList;
            sendData["data"] = respData;

            sendData = common.commonController.getSuccessSendData(
                sendData.data,
                "Events List Found"
            );
        } else {
            sendData = common.commonController.getSuccessSendData(
                {},
                "Events List Does Not Found"
            );
        }
    } catch (err) {
        sendData = common.commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const ADD_EVENTS_IMAGES = async function (
        data: {
        infographic_and_did_you_know_imagesid?: string; // _id exists or not
        image: string;
        report_title: string;
        createddate: string;
        parent_id?: string;
    },
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    const bodyData = data;
    
    console.log("bodyData: ", bodyData);
    try {
        // _id exists or not (using infographic_and_did_you_know_imagesid)
        if (bodyData.infographic_and_did_you_know_imagesid) {
            const eventsId = parseInt(bodyData.infographic_and_did_you_know_imagesid, 10);

            const updatedEvents = await updateOne(
                    "infographic_and_did_you_know_images",
                    ["image", "report_title", "createddate"],
                    "infographic_and_did_you_know_imagesid = $4",
                    [
                        bodyData.image,
                        bodyData.report_title,
                        bodyData.createddate,
                        eventsId // use the parsed integer here
                    ]
                );
                if (updatedEvents) {
                    sendData = commonController.getSuccessSendData(updatedEvents, "Events updated successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update Events.");
                }
        } else {
            const addEvents = await insertOne(
                    "infographic_and_did_you_know_images",
                    [
                        "image",
                        "report_title",
                        "createddate",
                        "parent_id",
                        "type"
                    ],
                    [
                        bodyData.image,
                        bodyData.report_title,
                        bodyData.createddate,
                        bodyData.parent_id,
                        "events"
                    ]
                );
                if (addEvents) {
                    sendData = commonController.getSuccessSendData(addEvents, "Events added successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add Events.");
                }
        }
    } catch (error) {
        // Exception occurred or not (catch)
        console.error("Error while adding/updating Events:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

export const VIEW_EVENTS_IMAGES = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const condition = "infographic_and_did_you_know_imagesid = $1";
        const values = [bodyData.id];

        const events = await selectFields(
            "infographic_and_did_you_know_images",
            ["infographic_and_did_you_know_imagesid", "image", "report_title", "createddate"],
            condition,
            values
        );

        if (events) {
            sendData = commonController.getSuccessSendData(events, "Events Found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Events not Found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const DELETE_EVENTS_IMAGES = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const eventsId = bodyData.id;

        const deletedEvents = await deleteOne(
            "infographic_and_did_you_know_images",
            "infographic_and_did_you_know_imagesid = $1",
            [eventsId]
        );

        if (deletedEvents) {
            sendData = commonController.getSuccessSendData(deletedEvents, "Events Deleted Successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Events not Deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_EVENTS_IMAGES = async (data: any, callback: (result: SendData) => void) => {
    let sendData = common.commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        const parentId = data.infographic_and_did_you_know_imagesid;
    console.log("parentId: ", parentId);

        const didYoyKnowAboutList = await selectJoin(
            `SELECT * FROM infographic_and_did_you_know_images WHERE type = 'events' AND parent_id = $3 ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
            [limit, offset, parentId]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM infographic_and_did_you_know_images WHERE type = 'events' AND parent_id = $1`,
            [parentId]
        ) as { count: string }[];

        const total_did_you_know_image = parseInt(countResult[0]?.count || "0");

        if (didYoyKnowAboutList.length > 0) {
            const allowedKeys = ["infographic_and_did_you_know_imagesid","image", "report_title", "createddate"];

            // ✅ Use safe key check
            const filteredList = didYoyKnowAboutList.map((item: any) => {
                const filtered: any = {};
                allowedKeys.forEach((key) => {
                    if (item[key] !== undefined) {
                        filtered[key] = item[key];
                    }
                });
                return filtered;
            });

            const respData = common.paginationSetup({
                start,
                limit,
                numRows: total_did_you_know_image,
                currentRows: filteredList,
            });

            respData.list = filteredList;
            sendData["data"] = respData;

            sendData = common.commonController.getSuccessSendData(
                sendData.data,
                "News List Found"
            );
        } else {
            sendData = common.commonController.getSuccessSendData(
                {},
                "Did you know image List Does Not Found"
            );
        }
    } catch (err) {
        sendData = common.commonController.getErrorSendData(err);
    }
    callback(sendData);
};
