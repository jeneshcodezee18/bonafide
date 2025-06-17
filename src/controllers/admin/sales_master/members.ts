import { commonController } from "../common/common";
import * as common from "../common/common"
import { deleteOne, insertOne, selectFields, selectJoin, updateOne, } from "../../../util/commonQuery";

interface SendData {
    status: number;
    err: number;
    data: object;
    msg: string;
}

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
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    const bodyData = data;
    try {
        if (bodyData.memberid) {
            const memberId = parseInt(bodyData.memberid, 10);
            const existMember = await selectFields(
                "member_master",
                ["memberid"],
                "email = $1 AND memberid != $2",
                [bodyData.email, memberId]
            );
            if (existMember) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Member already exists.");
            } else {
                const updatedMember = await updateOne(
                    "member_master",
                    [
                        "f_name", "l_name", "email", "image", "mobile_number",
                        "whatsapp_number", "designation", "calendly_url", "linkedin_url", "type", "status"
                    ],
                    "memberid = $12",
                    [
                        bodyData.f_name,
                        bodyData.l_name,
                        bodyData.email,
                        bodyData.image,
                        bodyData.mobile_number,
                        bodyData.whatsapp_number,
                        bodyData.designation,
                        bodyData.calendly_url,
                        bodyData.linkedin_url,
                        bodyData.type,
                        bodyData.status,
                        memberId
                    ]
                );
                if (updatedMember) {
                    sendData = commonController.getSuccessSendData(updatedMember, "Member updated successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update member.");
                }
            }
        } else {
            const existMember = await selectFields(
                "member_master",
                ["memberid"],
                "email = $1",
                [bodyData.email]
            );
            if (existMember) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Member already exists.");
            } else {
                const addMember = await insertOne(
                    "member_master",
                    [
                        "f_name", "l_name", "email", "image", "mobile_number",
                        "whatsapp_number", "designation", "calendly_url", "linkedin_url", "type", "status", "createddate"
                    ],
                    [
                        bodyData.f_name,
                        bodyData.l_name,
                        bodyData.email,
                        bodyData.image,
                        bodyData.mobile_number,
                        bodyData.whatsapp_number,
                        bodyData.designation,
                        bodyData.calendly_url,
                        bodyData.linkedin_url,
                        bodyData.type,
                        bodyData.status,
                        new Date()
                    ]
                );
                if (addMember) {
                    sendData = commonController.getSuccessSendData(addMember, "Member added successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add member.");
                }
            }
        }
    } catch (error) {
        console.error("Error while adding/updating member:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

// VIEW MEMBER
export const VIEW_MEMBER = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const condition = "memberid = $1";
        const values = [bodyData.memberid];

        const member = await selectFields(
            "member_master",
            [
                "memberid", "f_name", "l_name", "email", "image", "mobile_number",
                "whatsapp_number", "designation", "calendly_url", "linkedin_url", "type", "status", "createddate"
            ],
            condition,
            values
        );

        if (member) {
            sendData = commonController.getSuccessSendData(member, "Member Found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Member not Found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

// DELETE MEMBER
export const DELETE_MEMBER = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const memberId = bodyData.memberid || bodyData.id;

        const deletedMember = await deleteOne(
            "member_master",
            "memberid = $1",
            [memberId]
        );

        if (deletedMember) {
            sendData = commonController.getSuccessSendData(deletedMember, "Member Deleted Successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Member not Deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

// LIST MEMBERS
export const LIST_MEMBERS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        const memberList = await selectJoin(
            `SELECT * FROM member_master ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM member_master`,
            []
        ) as { count: string }[];

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