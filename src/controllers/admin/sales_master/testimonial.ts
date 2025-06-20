import { commonController } from "../common/common";
import * as common from "../common/common"
import { deleteOne, insertOne, selectFields, selectJoin, updateOne, } from "../../../util/commonQuery";

interface SendData {
    status: number;
    err: number;
    data: object;
    msg: string;
}

// ADD OR UPDATE TESTIMONIAL
export const ADD_TESTIMONIAL = async function (
    data: {
        testimonialid?: string;
        title: string;
        name: string;
        post: string;
        description: string;
    },
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    const bodyData = data;
    try {
        if (bodyData.testimonialid) {
            const testimonialId = parseInt(bodyData.testimonialid, 10);
            const updatedTestimonial = await updateOne(
                "testimonial",
                ["title", "name", "post", "description"],
                "testimonialid = $5",
                [
                    bodyData.title,
                    bodyData.name,
                    bodyData.post,
                    bodyData.description,
                    testimonialId
                ]
            );
            if (updatedTestimonial) {
                sendData = commonController.getSuccessSendData(updatedTestimonial, "Testimonial updated successfully");
            } else {
                sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update testimonial.");
            }
        } else {
            const addTestimonial = await insertOne(
                "testimonial",
                ["title", "name", "post", "description", "createddate"],
                [
                    bodyData.title,
                    bodyData.name,
                    bodyData.post,
                    bodyData.description,
                    new Date()
                ]
            );
            if (addTestimonial) {
                sendData = commonController.getSuccessSendData(addTestimonial, "Testimonial added successfully");
            } else {
                sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add testimonial.");
            }
        }
    } catch (error) {
        console.error("Error while adding/updating testimonial:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

// VIEW TESTIMONIAL
export const VIEW_TESTIMONIAL = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const condition = "testimonialid = $1";
        const values = [bodyData.testimonialid];

        const testimonial = await selectFields(
            "testimonial",
            ["testimonialid", "title", "name", "post", "description", "createddate"],
            condition,
            values
        );

        if (testimonial) {
            sendData = commonController.getSuccessSendData(testimonial, "Testimonial Found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Testimonial not Found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

// DELETE TESTIMONIAL
export const DELETE_TESTIMONIAL = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const testimonialId = bodyData.testimonialid || bodyData.id;

        const deletedTestimonial = await deleteOne(
            "testimonial",
            "testimonialid = $1",
            [testimonialId]
        );

        if (deletedTestimonial) {
            sendData = commonController.getSuccessSendData(deletedTestimonial, "Testimonial Deleted Successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Testimonial not Deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

// LIST TESTIMONIALS
export const LIST_TESTIMONIALS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        const testimonialList = await selectJoin(
            `SELECT * FROM testimonial ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM testimonial`,
            []
        ) as { count: string }[];

        const total_testimonials = parseInt(countResult[0]?.count || "0");

        if (testimonialList.length > 0) {
            const respData = common.paginationSetup({
                start,
                limit,
                numRows: total_testimonials,
                currentRows: testimonialList as object[],
            });
            respData.list = testimonialList as object[];
            sendData["data"] = respData;

            sendData = commonController.getSuccessSendData(
                sendData.data,
                "Testimonial List Found"
            );
        } else {
            sendData = commonController.getSuccessSendData(
                {},
                "Testimonial List Does Not Found"
            );
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};