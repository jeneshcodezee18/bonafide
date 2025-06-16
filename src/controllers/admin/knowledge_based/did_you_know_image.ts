import { deleteOne, insertOne, selectFields, selectJoin, updateOne } from "../../../util/commonQuery";
import * as common from "../common/common"
import { commonController } from "../common/common";

interface SendData {
    status: number;
    err: number;
    data: object; // More specific type than `object`
    msg: string;
}

export const ADD_DID_YOU_KNOW_IMAGE = async function (
        data: {
        infographic_and_did_you_know_imagesid?: string; // _id exists or not
        parent_id?: string;
        image: string;
        report_title: string;
        createddate: string;
    },
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    const bodyData = data;
    try {
        // _id exists or not (using infographic_and_did_you_know_imagesid)
        if (bodyData.infographic_and_did_you_know_imagesid) {
            const didYoyKnowId = parseInt(bodyData.infographic_and_did_you_know_imagesid, 10);
            const existDidYouKnowImage = await selectFields(
                "infographic_and_did_you_know_images",
                ["infographic_and_did_you_know_imagesid"],
                "title = $1 AND infographic_and_did_you_know_imagesid != $2",
                [bodyData.report_title, didYoyKnowId]
            );
            if (existDidYouKnowImage) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Title already exists.");
            } else {
                // updatedJob was updated or not
                const updatedJob = await updateOne(
                    "infographic_and_did_you_know_images",
                    ["image", "report_title", "createddate"],
                    "infographic_and_did_you_know_imagesid = $4",
                    [
                        bodyData.image,
                        bodyData.report_title,
                        bodyData.createddate,
                        didYoyKnowId // use the parsed integer here
                    ]
                );
                if (updatedJob) {
                    sendData = commonController.getSuccessSendData(updatedJob, "Did you know image updated successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update Did you know image.");
                }
            }
        } else {
            // existDidYouKnowImage already exists or not
            const existDidYouKnowImage = await selectFields(
                "infographic_and_did_you_know_images",
                ["infographic_and_did_you_know_imagesid"],
                "report_title = $1",
                [bodyData.report_title]
            );
            console.log("existDidYouKnowImage: ", existDidYouKnowImage);
            if (existDidYouKnowImage) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Title already exists.");
            } else {
                // addDidYouKnowImage was added or not
                const addDidYouKnowImage = await insertOne(
                    "infographic_and_did_you_know_images",
                    [
                        "image",
                        "report_title",
                        "createddate",
                    ],
                    [
                        bodyData.image,
                        bodyData.report_title,
                        bodyData.createddate,
                    ]
                );
                console.log("addDidYouKnowImage: ", addDidYouKnowImage);
                if (addDidYouKnowImage) {
                    sendData = commonController.getSuccessSendData(addDidYouKnowImage, "Did you know image added successfully");
                    console.log("sendData: ", sendData);
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add Did you know image.");
                }
            }
        }
    } catch (error) {
        // Exception occurred or not (catch)
        console.error("Error while adding/updating Did you know image:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

export const VIEW_DID_YOU_KNOW_IMAGE = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const condition = "infographic_and_did_you_know_imagesid = $1";
        const values = [bodyData.id];

        const didYouKnowImage = await selectFields(
            "infographic_and_did_you_know_images",
            ["infographic_and_did_you_know_imagesid", "image", "report_title", "createddate"],
            condition,
            values
        );

        if (didYouKnowImage) {
            sendData = commonController.getSuccessSendData(didYouKnowImage, "Did you know image Found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Did you know image not Found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const DELETE_DID_YOU_KNOW_IMAGE = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const didYouKnowImageId = bodyData.id;

        const deletedJob = await deleteOne(
            "infographic_and_did_you_know_images",
            "infographic_and_did_you_know_imagesid = $1",
            [didYouKnowImageId]
        );

        if (deletedJob) {
            sendData = commonController.getSuccessSendData(deletedJob, "Job Deleted Successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Job not Deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_DID_YOU_KNOW_IMAGE = async (data: any, callback: (result: SendData) => void) => {
    let sendData = common.commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        console.log("start: ", start);
        const limit = parseInt(data.limit) || 10;
        console.log("limit: ", limit);
        const offset = (start - 1) * limit;
        console.log("offset: ", offset);

        const didYoyKnowAboutList = await selectJoin(
            `SELECT * FROM infographic_and_did_you_know_images ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM infographic_and_did_you_know_images`,
            []
        ) as { count: string }[];

        const total_did_you_know_image = parseInt(countResult[0]?.count || "0");
        console.log("total_did_you_know_image: ", total_did_you_know_image);

        console.log("didYoyKnowAboutList: ", didYoyKnowAboutList);
        if (didYoyKnowAboutList.length > 0) {
            const respData = common.paginationSetup({
                start,
                limit,
                numRows: total_did_you_know_image,
                currentRows: didYoyKnowAboutList as object[],
            });
            respData.list = didYoyKnowAboutList as object[];
            sendData["data"] = respData;

            sendData = common.commonController.getSuccessSendData(
                sendData.data,
                "Did you know image List Found"
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