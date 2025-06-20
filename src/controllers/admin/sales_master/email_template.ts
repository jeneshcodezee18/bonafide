import { commonController } from "../common/common";
import * as common from "../common/common";
import {
  // deleteOne,
  deleteQuery,
  // insertOne,
  insertQuery,
  // selectFields,
  selectJoin,
  selectQuery,
  // updateOne,
  updateQuery,
} from "../../../util/commonQuery";
import { CallbackFunction } from "../../../types/common";
import { TABLES } from "../../../util/constants/table_names";

// ADD OR UPDATE EMAIL TEMPLATE
export const ADD_EMAIL_TEMPLATE = async function (
  data: {
    templateid?: string;
    subject: string;
    from_email: string;
    reply_email: string;
    email_body: string;
  },
  callback: CallbackFunction
) {
  let sendData = commonController.getSendData();
  const bodyData = data;
  try {
    if (bodyData.templateid) {
      const templateId = parseInt(bodyData.templateid, 10);
      // const updatedTemplate = await updateOne(
      //   "email_template",
      //   ["subject", "from_email", "reply_email", "email_body"],
      //   "templateid = $5",
      //   [
      //     bodyData.subject,
      //     bodyData.from_email,
      //     bodyData.reply_email,
      //     bodyData.email_body,
      //     templateId,
      //   ]
      // );

      const updatedTemplate = await updateQuery(
        {
          subject: bodyData.subject,
          from_email: bodyData.from_email,
          reply_email: bodyData.reply_email,
          email_body: bodyData.email_body,
        },
        TABLES.EMAIL_TEMPLATE,
        {
          templateid: templateId,
        }
      );

      if (updatedTemplate) {
        sendData = commonController.getSuccessSendData(
          updatedTemplate,
          "Email template updated successfully"
        );
      } else {
        sendData = commonController.getErrorSendData(
          {},
          400,
          {},
          "Failed to update email template."
        );
      }
    } else {
      // const addTemplate = await insertOne(
      //   "email_template",
      //   ["subject", "from_email", "reply_email", "email_body", "date"],
      //   [
      //     bodyData.subject,
      //     bodyData.from_email,
      //     bodyData.reply_email,
      //     bodyData.email_body,
      //     new Date(),
      //   ]
      // );

      const addTemplate = await insertQuery(
        {
          subject: bodyData.subject,
          from_email: bodyData.from_email,
          reply_email: bodyData.reply_email,
          email_body: bodyData.email_body,
          date: new Date(),
        },
        TABLES.EMAIL_TEMPLATE,
        "*" // or ["templateid"] if needed
      );

      if (addTemplate) {
        sendData = commonController.getSuccessSendData(
          addTemplate,
          "Email template added successfully"
        );
      } else {
        sendData = commonController.getErrorSendData(
          {},
          400,
          {},
          "Failed to add email template."
        );
      }
    }
  } catch (error) {
    console.error("Error while adding/updating email template:", error);
    sendData = commonController.getErrorSendData(
      {},
      500,
      {},
      "Internal server error."
    );
  }
  callback(sendData);
};

// VIEW EMAIL TEMPLATE
export const VIEW_EMAIL_TEMPLATE = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    // const condition = "templateid = $1";
    // const values = [bodyData.templateid];

    // const template = await selectFields(
    //   "email_template",
    //   [
    //     "templateid",
    //     "subject",
    //     "from_email",
    //     "reply_email",
    //     "email_body",
    //     "date",
    //   ],
    //   condition,
    //   values
    // );

    const template = await selectQuery(
      {
        templateid: bodyData.templateid,
      },
      TABLES.EMAIL_TEMPLATE,
      [
        "templateid",
        "subject",
        "from_email",
        "reply_email",
        "email_body",
        "date",
      ]
    );

    if (template.length) {
      sendData = commonController.getSuccessSendData(
        template[0],
        "Email template found"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        404,
        {},
        "Email template not found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

// DELETE EMAIL TEMPLATE
export const DELETE_EMAIL_TEMPLATE = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    const templateId = bodyData.templateid || bodyData.id;

    // const deletedTemplate = await deleteOne(
    //   "email_template",
    //   "templateid = $1",
    //   [templateId]
    // );

    const deletedTemplate = await deleteQuery(
      {
        templateid: templateId,
      },
      TABLES.EMAIL_TEMPLATE
    );

    if (deletedTemplate) {
      sendData = commonController.getSuccessSendData(
        deletedTemplate,
        "Email template deleted successfully"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        400,
        {},
        "Email template not deleted"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

// LIST EMAIL TEMPLATES
export const LIST_EMAIL_TEMPLATES = async (
  data: any,
  callback: CallbackFunction
) => {
  let sendData = commonController.getSendData();
  try {
    const start = parseInt(data.start) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (start - 1) * limit;

    const templateList = await selectJoin(
      `SELECT * FROM ${TABLES.EMAIL_TEMPLATE} ORDER BY date DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = (await selectJoin(
      `SELECT COUNT(*) as count FROM ${TABLES.EMAIL_TEMPLATE}`,
      []
    )) as { count: string }[];

    const total_templates = parseInt(countResult[0]?.count || "0");

    if (templateList.length > 0) {
      const respData = common.paginationSetup({
        start,
        limit,
        numRows: total_templates,
        currentRows: templateList as object[],
      });
      respData.list = templateList as object[];
      sendData["data"] = respData;

      sendData = commonController.getSuccessSendData(
        sendData.data,
        "Email template list found"
      );
    } else {
      sendData = commonController.getSuccessSendData(
        {},
        "Email template list not found"
      );
    }
  } catch (err) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};
