import { commonController } from "../common/common";
import * as common from "../common/common"
import { deleteOne, insertOne, selectFields, selectJoin, updateOne, selectManyFields } from "../../../util/commonQuery";

interface SendData {
    status: number;
    err: number;
    data: object;
    msg: string;
}

export const ADD_LEAD = async function (
    data: {
        id?: string;
        report_name: string;
        product_code: string;
        published_date: string;
        companies: string;
        leads: number;
        database_name: string;
        extracted_by: number;
    },
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    const bodyData = data;
    try {
        if (bodyData.id) {
            const leadId = parseInt(bodyData.id, 10);
            const updatedLead = await updateOne(
                "lead_master",
                [
                    "report_name",
                    "product_code",
                    "published_date",
                    "companies",
                    "leads",
                    "database_name",
                    "extracted_by"
                ],
                "id = $8",
                [
                    bodyData.report_name,
                    bodyData.product_code,
                    bodyData.published_date,
                    bodyData.companies,
                    bodyData.leads,
                    bodyData.database_name,
                    bodyData.extracted_by,
                    leadId
                ]
            );
            if (updatedLead) {
                sendData = commonController.getSuccessSendData(updatedLead, "Lead updated successfully");
            } else {
                sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update lead.");
            }
        } else {
            const addLead = await insertOne(
                "lead_master",
                [
                    "report_name",
                    "product_code",
                    "published_date",
                    "companies",
                    "leads",
                    "database_name",
                    "extracted_by",
                    "created_at"
                ],
                [
                    bodyData.report_name,
                    bodyData.product_code,
                    bodyData.published_date,
                    bodyData.companies,
                    bodyData.leads,
                    bodyData.database_name,
                    bodyData.extracted_by,
                    new Date()
                ]
            );
            if (addLead) {
                sendData = commonController.getSuccessSendData(addLead, "Lead added successfully");
            } else {
                sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add lead.");
            }
        }
    } catch (error) {
        console.error("Error while adding/updating lead:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

export const VIEW_LEAD = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const condition = "id = $1";
        const values = [bodyData.id];

        const lead = await selectFields(
            "lead_master",
            [
                "id",
                "report_name",
                "product_code",
                "published_date",
                "companies",
                "leads",
                "database_name",
                "extracted_by",
                "created_at"
            ],
            condition,
            values
        );

        if (lead) {
            sendData = commonController.getSuccessSendData(lead, "Lead found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Lead not found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const DELETE_LEAD = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const leadId = bodyData.id;

        const deletedLead = await deleteOne(
            "lead_master",
            "id = $1",
            [leadId]
        );

        if (deletedLead) {
            sendData = commonController.getSuccessSendData(deletedLead, "Lead deleted successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Lead not deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_LEADS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        // Build WHERE clause based on filters
        const whereClauses: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (data.extracted_by) {
            whereClauses.push(`extracted_by = $${idx++}`);
            values.push(data.extracted_by);
        }
        if (data.publishedDateFrom) {
            whereClauses.push(`published_date >= $${idx++}`);
            values.push(data.publishedDateFrom);
        }
        if (data.publishedDateTo) {
            whereClauses.push(`published_date <= $${idx++}`);
            values.push(data.publishedDateTo);
        }
        if (data.productCode) {
            whereClauses.push(`product_code ILIKE $${idx++}`);
            values.push(`%${data.productCode}%`);
        }

        const where = whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

        // Main query
        const leadList = await selectJoin(
            `SELECT * FROM lead_master ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
            [...values, limit, offset]
        );

        // Count query
        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM lead_master ${where}`,
            values
        ) as { count: string }[];

        const total_leads = parseInt(countResult[0]?.count || "0");

        if (leadList.length > 0) {
            const respData = common.paginationSetup({
                start,
                limit,
                numRows: total_leads,
                currentRows: leadList as object[],
            });
            respData.list = leadList as object[];
            sendData["data"] = respData;

            sendData = commonController.getSuccessSendData(
                sendData.data,
                "Lead list found"
            );
        } else {
            sendData = commonController.getSuccessSendData(
                {},
                "Lead list not found"
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