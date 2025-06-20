import { CallbackFunction } from "../../../types/common";
import {
  //   deleteOne,
  deleteQuery,
  //   insertOne,
  insertQuery,
  //   selectFields,
  selectJoin,
  selectQuery,
  //   updateOne,
  updateQuery,
} from "../../../util/commonQuery";
import { TABLES } from "../../../util/constants/table_names";
import * as common from "../common/common";
import { commonController } from "../common/common";

export const ADD_DID_YOU_KNOW_IMAGE = async function (
  data: {
    infographic_and_did_you_know_imagesid?: string; // _id exists or not
    image: string;
    report_title: string;
    createddate: string;
    parent_id?: string;
  },
  callback: CallbackFunction
) {
  let sendData = commonController.getSendData();
  const bodyData = data;
  try {
    // _id exists or not (using infographic_and_did_you_know_imagesid)
    if (bodyData.infographic_and_did_you_know_imagesid) {
      const didYoyKnowId = parseInt(
        bodyData.infographic_and_did_you_know_imagesid,
        10
      );
      //     const existDidYouKnowImage: any = await selectFields(
      //     "infographic_and_did_you_know_images",
      //     ["infographic_and_did_you_know_imagesid"],
      //     "report_title = $1 AND infographic_and_did_you_know_imagesid != $2",
      //     [bodyData.report_title, didYoyKnowId]
      //   );

      const filters = {
        report_title: bodyData.report_title,
        infographic_and_did_you_know_imagesid: {
          notEqualTo: bodyData.infographic_and_did_you_know_imagesid,
        },
      };
      const existDidYouKnowImage = await selectQuery(
        filters,
        TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES,
        ["infographic_and_did_you_know_imagesid"]
      );
      if (existDidYouKnowImage.length) {
        sendData = commonController.getErrorSendData(
          {},
          200,
          {},
          "Title already exists."
        );
      } else {
        // updatedDidYouKnow was updated or not
        // const updatedDidYouKnow = await updateOne(
        //   "infographic_and_did_you_know_images",
        //   ["image", "report_title", "createddate"],
        //   "infographic_and_did_you_know_imagesid = $4",
        //   [
        //     bodyData.image,
        //     bodyData.report_title,
        //     bodyData.createddate,
        //     didYoyKnowId, // use the parsed integer here
        //   ]
        // );

        const updatedDidYouKnow = await updateQuery(
          {
            image: bodyData.image,
            report_title: bodyData.report_title,
            createddate: bodyData.createddate,
          },
          TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES,
          {
            infographic_and_did_you_know_imagesid: didYoyKnowId,
          }
        );

        if (updatedDidYouKnow) {
          sendData = commonController.getSuccessSendData(
            updatedDidYouKnow,
            "Did you know image updated successfully"
          );
        } else {
          sendData = commonController.getErrorSendData(
            {},
            400,
            {},
            "Failed to update Did you know image."
          );
        }
      }
    } else {
      // existDidYouKnowImage already exists or not
      //   const existDidYouKnowImage: any = await selectFields(
      //     "infographic_and_did_you_know_images",
      //     ["infographic_and_did_you_know_imagesid"],
      //     "report_title = $1",
      //     [bodyData.report_title]
      //   );

      const filters = {
        report_title: bodyData.report_title,
      };

      const existDidYouKnowImage: any = await selectQuery(
        filters,
        TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES,
        ["infographic_and_did_you_know_imagesid"]
      );

      if (existDidYouKnowImage) {
        sendData = commonController.getErrorSendData(
          {},
          200,
          {},
          "Title already exists."
        );
      } else {
        // addDidYouKnowImage was added or not
        // const addDidYouKnowImage = await insertOne(
        //   "infographic_and_did_you_know_images",
        //   ["image", "report_title", "createddate", "type"],
        //   [
        //     bodyData.image,
        //     bodyData.report_title,
        //     bodyData.createddate,
        //     "did_you_know",
        //   ]
        // );

        const addDidYouKnowImagePayload = {
          image: bodyData.image,
          report_title: bodyData.report_title,
          createddate: bodyData.createddate,
          type: "did_you_know",
        };

        const addDidYouKnowImage = await insertQuery(
          addDidYouKnowImagePayload,
          TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES
        );

        if (addDidYouKnowImage) {
          sendData = commonController.getSuccessSendData(
            addDidYouKnowImage,
            "Did you know image added successfully"
          );
        } else {
          sendData = commonController.getErrorSendData(
            {},
            400,
            {},
            "Failed to add Did you know image."
          );
        }
      }
    }
  } catch (error) {
    // Exception occurred or not (catch)
    console.error("Error while adding/updating Did you know image:", error);
    sendData = commonController.getErrorSendData(
      {},
      500,
      {},
      "Internal server error."
    );
  }
  callback(sendData);
};

export const VIEW_DID_YOU_KNOW_IMAGE = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    // const condition = "infographic_and_did_you_know_imagesid = $1";
    // const values = [bodyData.id];

    // const didYouKnowImage = await selectFields(
    //   "infographic_and_did_you_know_images",
    //   [
    //     "infographic_and_did_you_know_imagesid",
    //     "image",
    //     "report_title",
    //     "createddate",
    //   ],
    //   condition,
    //   values
    // );

    const filters = {
      infographic_and_did_you_know_imagesid: bodyData.id,
    };

    const didYouKnowImage = await selectQuery(
      filters,
      TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES,
      [
        "infographic_and_did_you_know_imagesid",
        "image",
        "report_title",
        "createddate",
      ]
    );

    if (didYouKnowImage) {
      sendData = commonController.getSuccessSendData(
        didYouKnowImage,
        "Did you know image Found"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        404,
        {},
        "Did you know image not Found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const DELETE_DID_YOU_KNOW_IMAGE = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    const didYouKnowImageId = bodyData.id;

    // const deletedDidYouKnowImage = await deleteOne(
    //   "infographic_and_did_you_know_images",
    //   "infographic_and_did_you_know_imagesid = $1",
    //   [didYouKnowImageId]
    // );

    const deletedDidYouKnowImage = await deleteQuery(
      {
        infographic_and_did_you_know_imagesid: didYouKnowImageId,
      },
      TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES
    );

    if (deletedDidYouKnowImage) {
      sendData = commonController.getSuccessSendData(
        deletedDidYouKnowImage,
        "Did you know image Deleted Successfully"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        400,
        {},
        "Did you know image not Deleted"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_DID_YOU_KNOW_IMAGE = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = common.commonController.getSendData();
  try {
    const start = parseInt(data.start) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (start - 1) * limit;

    const didYoyKnowAboutList = await selectJoin(
      `SELECT * FROM ${TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES} WHERE type = 'did_you_know' ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = (await selectJoin(
      `SELECT COUNT(*) as count FROM ${TABLES.INFOGRAPHIC_AND_DID_YOU_KNOW_IMAGES} WHERE type = 'did_you_know'`,
      []
    )) as { count: string }[];

    const total_did_you_know_image = parseInt(countResult[0]?.count || "0");

    if (didYoyKnowAboutList.length > 0) {
      const allowedKeys = [
        "infographic_and_did_you_know_imagesid",
        "image",
        "report_title",
        "createddate",
      ];

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
