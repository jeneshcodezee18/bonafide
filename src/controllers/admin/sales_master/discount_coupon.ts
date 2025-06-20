import { commonController } from "../common/common";
import {
  // deleteOne,
  deleteQuery,
  // insertOne,
  insertQuery,
  // selectFields,
  selectJoin,
  selectManyFields,
  selectQuery,
  // updateOne,
  updateQuery,
} from "../../../util/commonQuery";
import * as common from "../common/common";
import { CallbackFunction } from "../../../types/common";
import { TABLES } from "../../../util/constants/table_names";

export const ADD_COUPON = async function (
  data: any,
  callback: CallbackFunction
) {
  let sendData = commonController.getSendData();
  try {
    if (data.couponid) {
      const couponId = parseInt(data.couponid, 10);
      // const updatedCoupon = await updateOne(
      //   "coupon_master",
      //   [
      //     "coupon_name",
      //     "publisher_name",
      //     "category_name",
      //     "product_code_from",
      //     "product_code_to",
      //     "single_user_amount_from",
      //     "single_user_amount_to",
      //     "product_code",
      //     "license",
      //     "type",
      //     "coupon_type",
      //     "value",
      //     "limit_value",
      //     "product_date_start",
      //     "product_date_end",
      //     "show_hide",
      //     "region_id",
      //     "country_id",
      //     "expire_date",
      //   ],
      //   "couponid = $20",
      //   [
      //     data.coupon_name,
      //     data.publisher_name,
      //     data.category_name,
      //     data.product_code_from,
      //     data.product_code_to,
      //     data.single_user_amount_from,
      //     data.single_user_amount_to,
      //     data.product_code,
      //     data.license,
      //     data.type,
      //     data.coupon_type,
      //     data.value,
      //     data.limit_value,
      //     data.product_date_start,
      //     data.product_date_end,
      //     data.show_hide,
      //     data.region_id,
      //     data.country_id,
      //     data.expire_date,
      //     couponId,
      //   ]
      // );

      const updatedCouponPayload = {
        coupon_name: data.coupon_name,
        publisher_name: data.publisher_name,
        category_name: data.category_name,
        product_code_from: data.product_code_from,
        product_code_to: data.product_code_to,
        single_user_amount_from: data.single_user_amount_from,
        single_user_amount_to: data.single_user_amount_to,
        product_code: data.product_code,
        license: data.license,
        type: data.type,
        coupon_type: data.coupon_type,
        value: data.value,
        limit_value: data.limit_value,
        product_date_start: data.product_date_start,
        product_date_end: data.product_date_end,
        show_hide: data.show_hide,
        region_id: data.region_id,
        country_id: data.country_id,
        expire_date: data.expire_date,
      };

      const updatedCoupon = await updateQuery(
        updatedCouponPayload,
        TABLES.COUPON_MASTER,
        {
          couponid: couponId,
        }
      );

      if (updatedCoupon) {
        sendData = commonController.getSuccessSendData(
          updatedCoupon,
          "Coupon updated successfully"
        );
      } else {
        sendData = commonController.getErrorSendData(
          {},
          400,
          {},
          "Failed to update coupon."
        );
      }
    } else {
      // const addCoupon = await insertOne(
      //   "coupon_master",
      //   [
      //     "coupon_name",
      //     "publisher_name",
      //     "category_name",
      //     "product_code_from",
      //     "product_code_to",
      //     "single_user_amount_from",
      //     "single_user_amount_to",
      //     "product_code",
      //     "license",
      //     "type",
      //     "coupon_type",
      //     "value",
      //     "limit_value",
      //     "product_date_start",
      //     "product_date_end",
      //     "show_hide",
      //     "region_id",
      //     "country_id",
      //     "expire_date",
      //     "createddate",
      //   ],
      //   [
      //     data.coupon_name,
      //     data.publisher_name,
      //     data.category_name,
      //     data.product_code_from,
      //     data.product_code_to,
      //     data.single_user_amount_from,
      //     data.single_user_amount_to,
      //     data.product_code,
      //     data.license,
      //     data.type,
      //     data.coupon_type,
      //     data.value,
      //     data.limit_value,
      //     data.product_date_start,
      //     data.product_date_end,
      //     data.show_hide,
      //     data.region_id,
      //     data.country_id,
      //     data.expire_date,
      //     new Date(),
      //   ]
      // );

      const addCouponPayload = {
        coupon_name: data.coupon_name,
        publisher_name: data.publisher_name,
        category_name: data.category_name,
        product_code_from: data.product_code_from,
        product_code_to: data.product_code_to,
        single_user_amount_from: data.single_user_amount_from,
        single_user_amount_to: data.single_user_amount_to,
        product_code: data.product_code,
        license: data.license,
        type: data.type,
        coupon_type: data.coupon_type,
        value: data.value,
        limit_value: data.limit_value,
        product_date_start: data.product_date_start,
        product_date_end: data.product_date_end,
        show_hide: data.show_hide,
        region_id: data.region_id,
        country_id: data.country_id,
        expire_date: data.expire_date,
        createddate: new Date(),
      };

      const addCoupon = await insertQuery(
        addCouponPayload,
        TABLES.COUPON_MASTER
      );

      if (addCoupon) {
        sendData = commonController.getSuccessSendData(
          addCoupon,
          "Coupon added successfully"
        );
      } else {
        sendData = commonController.getErrorSendData(
          {},
          400,
          {},
          "Failed to add coupon."
        );
      }
    }
  } catch (error) {
    console.error("Error while adding/updating coupon:", error);
    sendData = commonController.getErrorSendData(
      {},
      500,
      {},
      "Internal server error."
    );
  }
  callback(sendData);
};

export const VIEW_COUPON = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    // const coupon = await selectFields(
    //   "coupon_master",
    //   [
    //     "couponid",
    //     "coupon_name",
    //     "publisher_name",
    //     "category_name",
    //     "product_code_from",
    //     "product_code_to",
    //     "single_user_amount_from",
    //     "single_user_amount_to",
    //     "product_code",
    //     "license",
    //     "type",
    //     "coupon_type",
    //     "value",
    //     "limit_value",
    //     "product_date_start",
    //     "product_date_end",
    //     "show_hide",
    //     "region_id",
    //     "country_id",
    //     "expire_date",
    //     "createddate",
    //   ],
    //   "couponid = $1",
    //   [data.couponid]
    // );

    const coupon = await selectQuery(
      {
        couponid: data.couponid,
      },
      TABLES.COUPON_MASTER,
      [
        "couponid",
        "coupon_name",
        "publisher_name",
        "category_name",
        "product_code_from",
        "product_code_to",
        "single_user_amount_from",
        "single_user_amount_to",
        "product_code",
        "license",
        "type",
        "coupon_type",
        "value",
        "limit_value",
        "product_date_start",
        "product_date_end",
        "show_hide",
        "region_id",
        "country_id",
        "expire_date",
        "createddate",
      ]
    );

    if (coupon.length) {
      sendData = commonController.getSuccessSendData(coupon[0], "Coupon found");
    } else {
      sendData = commonController.getErrorSendData(
        {},
        404,
        {},
        "Coupon not found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const DELETE_COUPON = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const couponId = data.couponid || data.id;
    // const deletedCoupon = await deleteOne("coupon_master", "couponid = $1", [
    //   couponId,
    // ]);

    const deletedCoupon = await deleteQuery(
      {
        couponid: couponId,
      },
      TABLES.COUPON_MASTER
    );
    if (deletedCoupon) {
      sendData = commonController.getSuccessSendData(
        deletedCoupon,
        "Coupon deleted successfully"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        400,
        {},
        "Coupon not deleted"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_COUPONS = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const start = parseInt(data.start) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (start - 1) * limit;

    const couponList = await selectJoin(
      `SELECT * FROM ${TABLES.COUPON_MASTER} ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = (await selectJoin(
      `SELECT COUNT(*) as count FROM ${TABLES.COUPON_MASTER}`,
      []
    )) as { count: string }[];

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
    callback(sendData);
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_CATEGORY = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const categories = await selectManyFields(
      TABLES.MASTER_CATEGORY,
      ["categoryid", "categoryname"],
      "parent_id = 0",
      []
    );
    if (categories) {
      sendData = commonController.getSuccessSendData(
        categories,
        "Category list found"
      );
    } else {
      sendData = commonController.getSuccessSendData([], "No categories found");
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_ALL_PUBLISHER = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const publishers = await selectManyFields(TABLES.PUBLISHER_NAME_MASTER, [
      "publisher_name_id",
      "publisher_name",
    ]);
    if (publishers) {
      sendData = commonController.getSuccessSendData(
        publishers,
        "Publisher list found"
      );
    } else {
      sendData = commonController.getSuccessSendData([], "No publishers found");
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_ALL_REGION = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const regions = await selectManyFields(TABLES.REGION_MASTER, [
      "region_id",
      "region_name",
    ]);
    if (regions) {
      sendData = commonController.getSuccessSendData(
        regions,
        "Region list found"
      );
    } else {
      sendData = commonController.getSuccessSendData([], "No regions found");
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_ALL_COUNTRY = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const countries = await selectManyFields(TABLES.COUNTRIES, ["id", "name"]);
    if (countries) {
      sendData = commonController.getSuccessSendData(
        countries,
        "Country list found"
      );
    } else {
      sendData = commonController.getSuccessSendData([], "No countries found");
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};
