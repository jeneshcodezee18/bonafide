import { commonController } from "../common/common";
import { deleteOne, insertOne, selectFields, selectJoin, updateOne } from "../../../util/commonQuery";
import * as common from "../common/common"

interface SendData {
    status: number;
    err: number;
    data: object;
    msg: string;
}

export const ADD_COUPON = async function (
    data: any,
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    try {
        if (data.couponid) {
            const couponId = parseInt(data.couponid, 10);
            const updatedCoupon = await updateOne(
                "coupon_master",
                [
                    "coupon_name", "publisher_name", "category_name", "product_code_from", "product_code_to",
                    "single_user_amount_from", "single_user_amount_to", "product_code", "license", "type",
                    "coupon_type", "value", "limit_value", "product_date_start", "product_date_end",
                    "show_hide", "region_id", "country_id", "expire_date"
                ],
                "couponid = $20",
                [
                    data.coupon_name, data.publisher_name, data.category_name, data.product_code_from, data.product_code_to,
                    data.single_user_amount_from, data.single_user_amount_to, data.product_code, data.license, data.type,
                    data.coupon_type, data.value, data.limit_value, data.product_date_start, data.product_date_end,
                    data.show_hide, data.region_id, data.country_id, data.expire_date, couponId
                ]
            );
            if (updatedCoupon) {
                sendData = commonController.getSuccessSendData(updatedCoupon, "Coupon updated successfully");
            } else {
                sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update coupon.");
            }
        } else {
            const addCoupon = await insertOne(
                "coupon_master",
                [
                    "coupon_name", "publisher_name", "category_name", "product_code_from", "product_code_to",
                    "single_user_amount_from", "single_user_amount_to", "product_code", "license", "type",
                    "coupon_type", "value", "limit_value", "product_date_start", "product_date_end",
                    "show_hide", "region_id", "country_id", "expire_date", "createddate"
                ],
                [
                    data.coupon_name, data.publisher_name, data.category_name, data.product_code_from, data.product_code_to,
                    data.single_user_amount_from, data.single_user_amount_to, data.product_code, data.license, data.type,
                    data.coupon_type, data.value, data.limit_value, data.product_date_start, data.product_date_end,
                    data.show_hide, data.region_id, data.country_id, data.expire_date, new Date()
                ]
            );
            if (addCoupon) {
                sendData = commonController.getSuccessSendData(addCoupon, "Coupon added successfully");
            } else {
                sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add coupon.");
            }
        }
    } catch (error) {
        console.error("Error while adding/updating coupon:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

export const VIEW_COUPON = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const coupon = await selectFields(
            "coupon_master",
            [
                "couponid", "coupon_name", "publisher_name", "category_name", "product_code_from", "product_code_to",
                "single_user_amount_from", "single_user_amount_to", "product_code", "license", "type",
                "coupon_type", "value", "limit_value", "product_date_start", "product_date_end",
                "show_hide", "region_id", "country_id", "expire_date", "createddate"
            ],
            "couponid = $1",
            [data.couponid]
        );
        if (coupon) {
            sendData = commonController.getSuccessSendData(coupon[0], "Coupon found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Coupon not found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const DELETE_COUPON = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const couponId = data.couponid || data.id;
        const deletedCoupon = await deleteOne(
            "coupon_master",
            "couponid = $1",
            [couponId]
        );
        if (deletedCoupon) {
            sendData = commonController.getSuccessSendData(deletedCoupon, "Coupon deleted successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Coupon not deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_COUPONS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        const couponList = await selectJoin(
            `SELECT * FROM coupon_master ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM coupon_master`,
            []
        ) as { count: string }[];

        const total_coupons = parseInt(countResult[0]?.count || "0");

        if (couponList.length > 0) {
            const respData = common.paginationSetup({
                start,
                limit,
                numRows: total_coupons,
                currentRows: couponList as object[],
            });
            respData.list = couponList as object[];
            sendData["data"] = respData;

            sendData = commonController.getSuccessSendData(
                sendData.data,
                "Coupon list found"
            );
        } else {
            sendData = commonController.getSuccessSendData(
                {},
                "Coupon list not found"
            );
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};