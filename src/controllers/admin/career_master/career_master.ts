import { commonController } from "../common/common";
import * as common from "../common/common";
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
import { CallbackFunction } from "../../../types/common";
import { TABLES } from "../../../util/constants/table_names";

export const ADD_JOB = async function (
  data: {
    career_jobsid?: string;
    title: string;
    job_code: string;
    url: string;
    image: string;
    short_description: string;
    description: string;
  },
  callback: CallbackFunction
) {
  let sendData = commonController.getSendData();
  const bodyData = data;
  try {
    // _id exists or not (using career_jobsid)
    if (bodyData.career_jobsid) {
      const jobId = parseInt(bodyData.career_jobsid, 10);
      //   const existJob = await selectFields(
      //     "career_jobs",
      //     ["career_jobsid"],
      //     "title = $1 AND job_code = $2 AND career_jobsid != $3",
      //     [bodyData.title, bodyData.job_code, jobId]
      //   );

      const existJob = await selectQuery(
        {
          title: bodyData.title,
          job_code: bodyData.job_code,
          career_jobsid: { notEqualTo: jobId },
        },
        TABLES.CAREER_JOBS
      );

      if (existJob.length) {
        sendData = commonController.getErrorSendData(
          {},
          200,
          {},
          "Job already exists."
        );
      } else {
        // updatedJob was updated or not
        // const updatedJob = await updateOne(
        //   "career_jobs",
        //   [
        //     "title",
        //     "job_code",
        //     "url",
        //     "image",
        //     "short_description",
        //     "description",
        //   ],
        //   "career_jobsid = $7",
        //   [
        //     bodyData.title,
        //     bodyData.job_code,
        //     bodyData.url,
        //     bodyData.image,
        //     bodyData.short_description,
        //     bodyData.description,
        //     jobId, // use the parsed integer here
        //   ]
        // );
        const updateJobPayload = {
          title: bodyData.title,
          job_code: bodyData.job_code,
          url: bodyData.url,
          image: bodyData.image,
          short_description: bodyData.short_description,
          description: bodyData.description,
        };
        const updatedJob = await updateQuery(
          updateJobPayload,
          TABLES.CAREER_JOBS,
          { career_jobsid: jobId }
        );
        if (updatedJob) {
          sendData = commonController.getSuccessSendData(
            updatedJob,
            "Job updated successfully"
          );
        } else {
          sendData = commonController.getErrorSendData(
            {},
            400,
            {},
            "Failed to update job."
          );
        }
      }
    } else {
      // existJob already exists or not
      //   const existJob = await selectFields(
      //     "career_jobs",
      //     ["career_jobsid"],
      //     "title = $1 AND job_code = $2",
      //     [bodyData.title, bodyData.job_code]
      //   );

      const existJob = await selectQuery(
        {
          title: bodyData.title,
          job_code: bodyData.job_code,
        },
        TABLES.CAREER_JOBS
      );

      if (existJob.length > 0) {
        sendData = commonController.getErrorSendData(
          {},
          200,
          {},
          "Job already exists."
        );
      } else {
        // addJob was added or not
        // const addJob = await insertOne(
        //   "career_jobs",
        //   [
        //     "title",
        //     "job_code",
        //     "url",
        //     "image",
        //     "short_description",
        //     "description",
        //     "createddate",
        //   ],
        //   [
        //     bodyData.title,
        //     bodyData.job_code,
        //     bodyData.url,
        //     bodyData.image,
        //     bodyData.short_description,
        //     bodyData.description,
        //     new Date(),
        //   ]
        // );

        const addJob = await insertQuery(
          {
            title: bodyData.title,
            job_code: bodyData.job_code,
            url: bodyData.url,
            image: bodyData.image,
            short_description: bodyData.short_description,
            description: bodyData.description,
            createddate: new Date(),
          },
          TABLES.CAREER_JOBS
        );

        if (addJob) {
          sendData = commonController.getSuccessSendData(
            addJob,
            "Job added successfully"
          );
        } else {
          sendData = commonController.getErrorSendData(
            {},
            400,
            {},
            "Failed to add job."
          );
        }
      }
    }
  } catch (error) {
    // Exception occurred or not (catch)
    console.error("Error while adding/updating job:", error);
    sendData = commonController.getErrorSendData(
      {},
      500,
      {},
      "Internal server error."
    );
  }
  callback(sendData);
};

export const VIEW_JOB = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    // const condition = "career_jobsid = $1";
    // const values = [bodyData.id];

    // const job = await selectFields(
    //   "career_jobs",
    //   [
    //     "career_jobsid",
    //     "title",
    //     "job_code",
    //     "url",
    //     "image",
    //     "short_description",
    //     "description",
    //     "createddate",
    //   ],
    //   condition,
    //   values
    // );

    const job = await selectQuery(
      {
        career_jobsid: bodyData.id,
      },
      TABLES.CAREER_JOBS,
      [
        "career_jobsid",
        "title",
        "job_code",
        "url",
        "image",
        "short_description",
        "description",
        "createddate",
      ]
    );

    if (job.length) {
      sendData = commonController.getSuccessSendData(job[0], "Job Found");
    } else {
      sendData = commonController.getErrorSendData(
        {},
        404,
        {},
        "Job not Found"
      );
    }
  } catch (err: any) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const DELETE_JOB = async (data: any, callback: CallbackFunction) => {
  let sendData = commonController.getSendData();
  try {
    const bodyData = data;
    const jobId = bodyData.id;

    // const deletedJob = await deleteOne("career_jobs", "career_jobsid = $1", [
    //   jobId,
    // ]);
    const deletedJob = await deleteQuery(
      {
        career_jobsid: jobId,
      },
      TABLES.CAREER_JOBS
    );
    if (deletedJob) {
      sendData = commonController.getSuccessSendData(
        deletedJob,
        "Job Deleted Successfully"
      );
    } else {
      sendData = commonController.getErrorSendData(
        {},
        400,
        {},
        "Job not Deleted"
      );
    }
  } catch (err: any) {
    sendData = commonController.getErrorSendData(err);
  }
  callback(sendData);
};

export const LIST_JOB = async (data: any, callback: CallbackFunction) => {
  let sendData = common.commonController.getSendData();
  try {
    const start = parseInt(data.start) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (start - 1) * limit;

    const jobList = await selectJoin(
      `SELECT * FROM career_jobs ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = (await selectJoin(
      `SELECT COUNT(*) as count FROM career_jobs`,
      []
    )) as { count: string }[];

    const total_jobs = parseInt(countResult[0]?.count || "0");

    if (jobList.length > 0) {
      const respData = common.paginationSetup({
        start,
        limit,
        numRows: total_jobs,
        currentRows: jobList as object[],
      });
      respData.list = jobList as object[];
      sendData["data"] = respData;

      sendData = common.commonController.getSuccessSendData(
        sendData.data,
        "Job List Found"
      );
    } else {
      sendData = common.commonController.getSuccessSendData(
        {},
        "Job List Does Not Found"
      );
    }
  } catch (err: any) {
    sendData = common.commonController.getErrorSendData(err);
  }
  callback(sendData);
};
