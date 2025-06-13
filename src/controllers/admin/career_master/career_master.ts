import { commonController } from "../common/common";
import * as common from "../common/common"
import { deleteOne, insertOne, selectFields, selectJoin, updateOne, } from "../../../util/commonQuery";

interface SendData {
    status: number;
    err: number;
    data: object; // More specific type than `object`
    msg: string;
}

export const ADD_JOB = async function (
    data: {
        career_jobsid?: string; // _id exists or not
        title: string;
        job_code: string;
        url: string;
        image: string;
        short_description: string;
        description: string;
    },
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    const bodyData = data;
    try {
        // _id exists or not (using career_jobsid)
        if (bodyData.career_jobsid) {
            // existFaq exists (here: existJob already exists or not)
            const existJob = await selectFields(
                "career_jobs",
                ["id"],
                "title = $1 AND job_code = $2 AND id != $3",
                [bodyData.title, bodyData.job_code, bodyData.career_jobsid]
            );
            if (existJob) {
                sendData = commonController.getSuccessSendData({}, "Job already exists.");
            } else {
                // updatedJob was updated or not
                const updatedJob = await updateOne(
                    "career_jobs",
                    ["title", "job_code", "url", "image", "short_description", "description"],
                    "id = $1",
                    [
                        bodyData.title,
                        bodyData.job_code,
                        bodyData.url,
                        bodyData.image,
                        bodyData.short_description,
                        bodyData.description,
                        bodyData.career_jobsid
                    ]
                );
                if (updatedJob) {
                    sendData = commonController.getSuccessSendData(updatedJob, "Job updated successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update job.");
                }
            }
        } else {
            // existJob already exists or not
            const existJob = await selectFields(
                "career_jobs",
                ["career_jobsid"],
                "title = $1 AND job_code = $2",
                [bodyData.title, bodyData.job_code]
            );
            if (existJob) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Job already exists.");
            } else {
                // addJob was added or not
                const addJob = await insertOne(
                    "career_jobs",
                    [
                        "title",
                        "job_code",
                        "url",
                        "image",
                        "short_description",
                        "description",
                        "createddate"
                    ],
                    [
                        bodyData.title,
                        bodyData.job_code,
                        bodyData.url,
                        bodyData.image,
                        bodyData.short_description,
                        bodyData.description,
                        new Date()
                    ]
                );
                if (addJob) {
                    sendData = commonController.getSuccessSendData(addJob, "Job added successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add job.");
                }
            }
        }
    } catch (error) {
        // Exception occurred or not (catch)
        console.error("Error while adding/updating job:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

export const VIEW_JOB = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const condition = "career_jobsid = $1";
        const values = [bodyData.id];

        const job = await selectFields(
            "career_jobs",
            ["career_jobsid", "title", "job_code", "url", "image", "short_description", "description", "createddate"],
            condition,
            values
        );

        if (job) {
            sendData = commonController.getSuccessSendData(job, "Job Found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Job not Found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const DELETE_JOB = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const jobId = bodyData.id;

        const deletedJob = await deleteOne(
            "career_jobs",
            "career_jobsid = $1",
            [jobId]
        );

        if (deletedJob) {
            sendData = commonController.getSuccessSendData(deletedJob, "Job Deleted Successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Job not Deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_JOB = async (data: any, callback: (result: SendData) => void) => {
    let sendData = common.commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        const jobList = await selectJoin(
            `SELECT * FROM career_jobs ORDER BY createddate DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM career_jobs`,
            []
        ) as { count: string }[];

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
    } catch (err) {
        sendData = common.commonController.getErrorSendData(err);
    }
    callback(sendData);
};