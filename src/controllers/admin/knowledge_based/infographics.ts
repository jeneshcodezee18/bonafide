import { CallbackFunction } from "../../../types/common";
import {
  //   deleteOne,
  deleteQuery,
  //   insertOne,
  insertQuery,
  //   selectFields,
  selectJoin,
  //   selectManyFields,
  selectQuery,
  //   updateOne,
  updateQuery,
} from "../../../util/commonQuery";
import { TABLES } from "../../../util/constants/table_names";
import * as common from "../common/common";
import { commonController } from "../common/common";

export const ADD_INFOGRAPHICS = async function (
  data: {
    infographic_and_did_you_know_imagesid?: string; // _id exists or not
    image: string;
    report_title: string;
    category: string;
    product_code: string;
    createddate: string;
    parent_id?: string;
  },
  callback: CallbackFunction
) {
  let sendData = commonController.getSendData();
  const bodyData = data;
  console.log("bodyData: ", bodyData);
  try {
    // _id exists or not (using infographic_and_did_you_know_imagesid)
    if (bodyData.infographic_and_did_you_know_imagesid) {
      const infographicsId = parseInt(
        bodyData.infographic_and_did_you_know_imagesid,
        10
      );
      //   const existInfographics: any = await selectFields(
      //     "infographic_and_did_you_know_images",
      //     ["infographic_and_did_you_know_imagesid"],
      //     "(report_title = $1 OR product_code = $2) AND infographic_and_did_you_know_imagesid != $3",
      //     [bodyData.report_title, bodyData.product_code, infographicsId]
      //   );

      const filters = {
        OR: {
          report_title: bodyData.report_title,
          product_code: bodyData.product_code,
        },
        infographic_and_did_you_know_imagesid: {
          notEqualTo: infographicsId,
        },
      };

      const existInfographics: any = await selectQuery(
        filters,
        TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES,
        ["infographic_and_did_you_know_imagesid"]
      );

      if (existInfographics.length) {
        sendData = commonController.getErrorSendData(
          {},
          200,
          {},
          "Title & Product Code already exists."
        );
      } else {
        // updatedInfographics was updated or not
        // const updatedInfographics = await updateOne(
        //   "infographic_and_did_you_know_images",
        //   ["image", "report_title", "category", "product_code", "createddate"],
        //   "infographic_and_did_you_know_imagesid = $6",
        //   [
        //     bodyData.image,
        //     bodyData.report_title,
        //     bodyData.category,
        //     bodyData.product_code,
        //     bodyData.createddate,
        //     infographicsId, // use the parsed integer here
        //   ]
        // );

        const updatedInfographics = await updateQuery(
          {
            image: bodyData.image,
            report_title: bodyData.report_title,
            category: bodyData.category,
            product_code: bodyData.product_code,
            createddate: bodyData.createddate,
          },
          TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES,
          {
            infographic_and_did_you_know_imagesid: infographicsId,
          }
        );

        if (updatedInfographics) {
          sendData = commonController.getSuccessSendData(
            updatedInfographics,
            "Infographics updated successfully"
          );
        } else {
          sendData = commonController.getErrorSendData(
            {},
            400,
            {},
            "Failed to update Infographics."
          );
        }
      }
    } else {
      // existInfographics already exists or not
      //   const existInfographics: any = await selectFields(
      //     "infographic_and_did_you_know_images",
      //     ["infographic_and_did_you_know_imagesid"],
      //     "report_title = $1 OR product_code = $2",
      //     [bodyData.report_title, bodyData.product_code]
      //   );

      const filters = {
        OR: {
          report_title: bodyData.report_title,
          product_code: bodyData.product_code,
        },
      };

      const existInfographics: any = await selectQuery(
        filters,
        TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES,
        ["infographic_and_did_you_know_imagesid"]
      );

      if (existInfographics.length) {
        sendData = commonController.getErrorSendData(
          {},
          200,
          {},
          "Title & Product Code already exists."
        );
      } else {
        // addInfographics was added or not
        // const addInfographics = await insertOne(
        //   "infographic_and_did_you_know_images",
        //   [
        //     "image",
        //     "report_title",
        //     "category",
        //     "product_code",
        //     "createddate",
        //     "type",
        //   ],
        //   [
        //     bodyData.image,
        //     bodyData.report_title,
        //     bodyData.category,
        //     bodyData.product_code,
        //     bodyData.createddate,
        //     "infographics",
        //   ]
        // );

        const addInfographics = await insertQuery(
          {
            image: bodyData.image,
            report_title: bodyData.report_title,
            category: bodyData.category,
            product_code: bodyData.product_code,
            createddate: bodyData.createddate,
            type: "infographics",
          },
          TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES,
          "*" // or you can specify columns like ["infographic_and_did_you_know_imagesid"]
        );

        console.log("addInfographics: ", addInfographics);
        if (addInfographics) {
          sendData = commonController.getSuccessSendData(
            addInfographics,
            "Infographics added successfully"
          );
        } else {
          sendData = commonController.getErrorSendData(
            {},
            400,
            {},
            "Failed to add Infographics."
          );
        }
      }
    }
  } catch (error) {
    // Exception occurred or not (catch)
    console.error("Error while adding/updating Infographics:", error);
    sendData = commonController.getErrorSendData(
      {},
      500,
      {},
      "Internal server error."
    );
  }
  callback(sendData);
};

export const VIEW_INFOGRAPHICS = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    // const condition = "infographic_and_did_you_know_imagesid = $1";
    // const values = [bodyData.id];

    // const infographicsImage = await selectFields(
    //   "infographic_and_did_you_know_images",
    //   [
    //     "infographic_and_did_you_know_imagesid",
    //     "image",
    //     "report_title",
    //     "category",
    //     "product_code",
    //     "createddate",
    //   ],
    //   condition,
    //   values
    // );

    const filters = {
      infographic_and_did_you_know_imagesid: bodyData.id,
    };

    const infographicsImage = await selectQuery(
      filters,
      TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES,
      [
        "infographic_and_did_you_know_imagesid",
        "image",
        "report_title",
        "category",
        "product_code",
        "createddate",
      ]
    );

    if (infographicsImage.length) {
      sendData = commonController.getSuccessSendData(
        infographicsImage[0],
        "Infographics Found"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        404,
        {},
        "Infographics not Found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const DELETE_INFOGRAPHICS = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    console.log("bodyData: ", bodyData);
    const infographicsId = bodyData.id;
    console.log("infographicsId: ", infographicsId);

    // const deletedInfographics = await deleteOne(
    //   "infographic_and_did_you_know_images",
    //   "infographic_and_did_you_know_imagesid = $1",
    //   [infographicsId]
    // );

    const deletedInfographics = await deleteQuery(
      {
        infographic_and_did_you_know_imagesid: infographicsId,
      },
      TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES
    );

    console.log("deletedInfographics: ", deletedInfographics);
    if (deletedInfographics) {
      sendData = commonController.getSuccessSendData(
        deletedInfographics,
        "Infographics Deleted Successfully"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        400,
        {},
        "Infographics not Deleted"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_INFOGRAPHICS = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = common.commonController.getSendData();
  try {
    const start = parseInt(data.start) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (start - 1) * limit;

    // ✅ Filter by type = 'infographics'
    const infographicsList = await selectJoin(
      `SELECT * FROM ${TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES} WHERE type = 'infographics' ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = (await selectJoin(
      `SELECT COUNT(*) as count FROM ${TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES} WHERE type = 'infographics'`,
      []
    )) as { count: string }[];

    const total_infographics = parseInt(countResult[0]?.count || "0");

    if (infographicsList.length > 0) {
      const allowedKeys = [
        "infographic_and_did_you_know_imagesid",
        "image",
        "report_title",
        "category",
        "product_code",
        "createddate",
      ];

      // ✅ Use safe key check
      const filteredList = infographicsList.map((item: any) => {
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
        numRows: total_infographics,
        currentRows: filteredList,
      });

      respData.list = filteredList;
      sendData["data"] = respData;

      sendData = common.commonController.getSuccessSendData(
        sendData.data,
        "Infographics List Found"
      );
    } else {
      sendData = common.commonController.getSuccessSendData(
        {},
        "Infographics List Does Not Found"
      );
    }
  } catch (err) {
    sendData = common.commonController.getErrorSendData(err);
  }

  callback(sendData);
};

export const LIST_CATEGORY = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    // const categories = await selectManyFields(
    //   "master_category",
    //   ["categoryid", "categoryname"],
    //   "parent_id = 0",
    //   []
    // );
    const filters = {
      parent_id: 0,
    };

    const categories = await selectQuery(filters, TABLES.MASTER_CATEGORY, [
      "categoryid",
      "categoryname",
    ]);
    console.log("categories: ", categories);
    if (categories.length) {
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
