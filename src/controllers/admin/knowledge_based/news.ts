import { deleteOne, insertOne, selectFields, selectJoin, updateOne } from "../../../util/commonQuery";
import { commonController } from "../common/common";
import * as common from "../common/common"

interface SendData {
    status: number;
    err: number;
    data: object; // More specific type than `object`
    msg: string;
}

export const ADD_NEWS = async function (
        data: {
        newsid?: string; // _id exists or not
        productcode: string;
        newstitle: string;
        source: string;
        sourceurl: string;
        description: string;
        image: string;
        status: string;
        sequence: string;
        createddate: string;
    },
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    const bodyData = data;
    console.log("bodyData: ", bodyData);
    try {
        // _id exists or not (using infographic_and_did_you_know_imagesid)
        if (bodyData.newsid) {
            const newsId = parseInt(bodyData.newsid, 10);
            const existNews: any = await selectFields(
                "news",
                ["newsid"],
                "(newstitle = $1 OR productcode = $2) AND newsid != $3",
                [bodyData.newstitle, bodyData.productcode, newsId]
            );
            console.log("existNews: ", existNews);
            if (existNews) {
                sendData = commonController.getErrorSendData({}, 200, {}, "News Title OR Product Code already exists.");
            } else {
                // updatedInfographics was updated or not
                const updatedInfographics = await updateOne(
                    "news",
                    ["productcode","newstitle","source", "sourceurl","description","image","status","sequence","createddate"],
                    "newsid = $10",
                    [
                        bodyData.productcode,
                        bodyData.newstitle,
                        bodyData.source,
                        bodyData.sourceurl,
                        bodyData.description,
                        bodyData.image,
                        bodyData.status,
                        bodyData.sequence,
                        bodyData.createddate,
                        newsId // use the parsed integer here
                    ]
                );
                console.log("updatedInfographics: ", updatedInfographics);
                if (updatedInfographics) {
                    sendData = commonController.getSuccessSendData(updatedInfographics, "News updated successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update News.");
                }
            }
        } else {
            // existNews already exists or not
            const existNews: any = await selectFields(
                "news",
                ["newsid"],
                "newstitle = $1 OR productcode = $2",
                [bodyData.newstitle , bodyData.productcode]
            );
            if (existNews) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Title & Product Code already exists.");
            } else {
                // addNews was added or not
                const addNews = await insertOne(
                    "news",
                    [
                        "productcode",
                        "newstitle",
                        "source",
                        "sourceurl",
                        "description",
                        "image",
                        "status",
                        "sequence",
                        "createddate",
                    ],
                    [
                        bodyData.productcode,
                        bodyData.newstitle,
                        bodyData.source,
                        bodyData.sourceurl,
                        bodyData.description,
                        bodyData.image,
                        bodyData.status,
                        bodyData.sequence,
                        bodyData.createddate,
                    ]
                );
                console.log("addNews: ", addNews);
                if (addNews) {
                    sendData = commonController.getSuccessSendData(addNews, "News added successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add News.");
                }
            }
        }
    } catch (error) {
        // Exception occurred or not (catch)
        console.error("Error while adding/updating News:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

export const VIEW_NEWS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const condition = "newsid = $1";
        const values = [bodyData.id];

        const news = await selectFields(
            "news",
            ["newsid", "productcode","newstitle","source", "sourceurl","description","image","status","sequence","createddate"],
            condition,
            values
        );

        if (news) {
            sendData = commonController.getSuccessSendData(news, "News Found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "News not Found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const DELETE_NEWS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        console.log("bodyData: ", bodyData);
        const newsId = bodyData.id;
        console.log("newsId: ", newsId);

        const deletedNews = await deleteOne(
            "news",
            "newsid = $1",
            [newsId]
        );

        console.log("deletedNews: ", deletedNews);
        if (deletedNews) {
            sendData = commonController.getSuccessSendData(deletedNews, "News Deleted Successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "News not Deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_NEWS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = common.commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        const newsList = await selectJoin(
            `SELECT * FROM news ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM news`,
            []
        ) as { count: string }[];

        const total_news = parseInt(countResult[0]?.count || "0");

        if (newsList.length > 0) {
            const respData = common.paginationSetup({
                start,
                limit,
                numRows: total_news,
                currentRows: newsList as object[],
            });
            respData.list = newsList as object[];
            sendData["data"] = respData;

            sendData = common.commonController.getSuccessSendData(
                sendData.data,
                "News List Found"
            );
        } else {
            sendData = common.commonController.getSuccessSendData(
                {},
                "News List Does Not Found"
            );
        }
    } catch (err) {
        sendData = common.commonController.getErrorSendData(err);
    }
    callback(sendData);
};