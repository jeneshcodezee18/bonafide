import { commonController } from "../common/common";
import * as common from "../common/common"
import { deleteQuery, insertQuery, selectJoin, selectManyFields, selectQuery, updateQuery, } from "../../../util/commonQuery";
import { TABLES } from "../../../util/constants/table_names";

interface SendData {
    status: number;
    err: number;
    data: object;
    msg: string;
}

export const ADD_REPORT_PROMOTIONAL = async function (
    data: any,
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    try {
        console.log("data: ", data);
        if (data.id) {
            // Update
            const updated = await updateQuery(
                {
                    report_list: data.report_list,
                    parts: data.parts,
                    published_date: data.published_date,
                    industry: data.industry,
                    sub_industry: data.sub_industry,
                    publisher: data.publisher,
                    type: data.type,
                    assigned_to: data.assigned_to,
                    lead_extracted: data.lead_extracted,
                    company: data.company,
                    email_status: data.email_status,
                    soutbound: data.soutbound,
                    moutbound: data.moutbound,
                    response: data.response,
                    date: data.date,
                    news_letter_published: data.news_letter_published,
                    infographics: data.infographics,
                    polls: data.polls,
                    blogs: data.blogs,
                    paid_promotion: data.paid_promotion
                },
                TABLES.REPORT_PROMOTION,
                { id: data.id }
            );
            if (updated) {
                sendData = commonController.getSuccessSendData(updated, "Report Promotion updated successfully");
            } else {
                sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update");
            }
        } else {
            // Insert
            const inserted = await insertQuery(
                {
                    report_list: data.report_list,
                    parts: data.parts,
                    published_date: data.published_date,
                    industry: data.industry,
                    sub_industry: data.sub_industry,
                    publisher: data.publisher,
                    type: data.type,
                    assigned_to: data.assigned_to,
                    lead_extracted: data.lead_extracted,
                    company: data.company, 
                    email_status: data.email_status,
                    soutbound: data.soutbound,
                    moutbound: data.moutbound,
                    response: data.response,
                    date: data.date,
                    news_letter_published: data.news_letter_published,
                    infographics: data.infographics,
                    polls: data.polls,
                    blogs: data.blogs,
                    paid_promotion: data.paid_promotion,
                },
                TABLES.REPORT_PROMOTION,
                "*"
            );
            console.log("inserted: ", inserted);
            if (inserted) {
                sendData = commonController.getSuccessSendData(inserted, "Report Promotion added successfully");
            } else {
                sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add");
            }
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const VIEW_REPORT_PROMOTIONAL = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const id = data.id;
        const result = await selectQuery(
            { id },
            TABLES.REPORT_PROMOTION
        );
        if (result) {
            sendData = commonController.getSuccessSendData(result, "Found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Not Found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const DELETE_REPORT_PROMOTIONAL = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const id = data.id;
        const deleted = await deleteQuery(
            { id },
            TABLES.REPORT_PROMOTION
        );
        if (deleted) {
            sendData = commonController.getSuccessSendData({}, "Deleted successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Delete failed");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_REPORT_PROMOTIONAL = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        const list = await selectJoin(
            `SELECT * FROM report_promotion ORDER BY id DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM report_promotion`,
            []
        ) as { count: string }[];

        const total = parseInt(countResult[0]?.count || "0");

        if (list.length > 0) {
            const respData = common.paginationSetup({
                start,
                limit,
                numRows: total,
                currentRows: list as object[],
            });
            respData.list = list as object[];
            sendData["data"] = respData;

            sendData = commonController.getSuccessSendData(
                sendData.data,
                "List Found"
            );
        } else {
            sendData = commonController.getSuccessSendData(
                {},
                "List Not Found"
            );
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_ASSIGNED_MEMBERS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const members = await selectManyFields(
            "member_master",
            ["memberid", "f_name", "l_name"]
        );
        if (members) {
            sendData = commonController.getSuccessSendData(members, "Member list found");
        } else {
            sendData = commonController.getSuccessSendData([], "No members found");
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