import { deleteOne, insertOne, selectFields, selectJoin, selectManyFields, updateOne } from "../../../util/commonQuery";
import { commonController } from "../common/common";
import * as common from "../common/common"

interface SendData {
    status: number;
    err: number;
    data: object; // More specific type than `object`
    msg: string;
}

export const ADD_BLOGS = async function (
        data: {
        id?: string; // _id exists or not
        blog_title: string;
        blog_slug: string;
        category: string;
        short_description: string;
        long_description: string;
        thumbnail: string;
        featured_image: string;
        date: string;
        meta_title: string;
        meta_description: string;
    },
    callback: (result: SendData) => void
) {
    let sendData = commonController.getSendData();
    const bodyData = data;
    console.log("bodyData: ", bodyData);
    try {
        // _id exists or not (using id)
        if (bodyData.id) {
            const blogId = parseInt(bodyData.id, 10);
            const existBlogs: any = await selectFields(
                "blogs",
                ["id"],
                "blog_title = $1 AND id != $2",
                [bodyData.blog_title, blogId]
            );
            console.log("existBlogs: ", existBlogs);
            if (existBlogs) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Blogs Title Code already exists.");
            } else {
                // updateBlogs was updated or not
                const updateBlogs = await updateOne(
                    "blogs",
                    ["blog_title","blog_slug","category_id","short_description", "long_description","thumbnail","blog_image","published_date","meta_title","meta_description"],
                    "id = $11",
                    [
                        bodyData.blog_title,
                        bodyData.blog_slug,
                        bodyData.category,
                        bodyData.short_description,
                        bodyData.long_description,
                        bodyData.thumbnail,
                        bodyData.featured_image,
                        bodyData.date,
                        bodyData.meta_title,
                        bodyData.meta_description,
                        blogId // use the parsed integer here
                    ]
                );
                console.log("updateBlogs: ", updateBlogs);
                if (updateBlogs) {
                    sendData = commonController.getSuccessSendData(updateBlogs, "Blogs updated successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to update Blogs.");
                }
            }
        } else {
            // existBlogs already exists or not
            const existBlogs: any = await selectFields(
                "blogs",
                ["id"],
                "blog_title = $1",
                [bodyData.blog_title ]
            );
            if (existBlogs) {
                sendData = commonController.getErrorSendData({}, 200, {}, "Title & Product Code already exists.");
            } else {
                // addBlogs was added or not
                const addBlogs = await insertOne(
                    "blogs",
                    [
                        "blog_title",
                        "blog_slug",
                        "category_id",
                        "short_description",
                        "long_description",
                        "thumbnail",
                        "blog_image",
                        "published_date",
                        "meta_title",
                        "meta_description"
                    ],
                    [
                        bodyData.blog_title,
                        bodyData.blog_slug,
                        bodyData.category,
                        bodyData.short_description,
                        bodyData.long_description,
                        bodyData.thumbnail,
                        bodyData.featured_image,
                        bodyData.date,
                        bodyData.meta_title,
                        bodyData.meta_description,
                    ]
                );
                if (addBlogs) {
                    sendData = commonController.getSuccessSendData(addBlogs, "Blogs added successfully");
                } else {
                    sendData = commonController.getErrorSendData({}, 400, {}, "Failed to add Blogs.");
                }
            }
        }
    } catch (error) {
        // Exception occurred or not (catch)
        console.error("Error while adding/updating Blogs:", error);
        sendData = commonController.getErrorSendData({}, 500, {}, "Internal server error.");
    }
    callback(sendData);
};

export const VIEW_BLOGS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        const condition = "id = $1";
        const values = [bodyData.id];

        const blogs = await selectFields(
            "blogs",
            ["id", "blog_title","category_id","short_description", "long_description","thumbnail","blog_image","published_date","meta_title","meta_description"],
            condition,
            values
        );

        if (blogs) {
            sendData = commonController.getSuccessSendData(blogs, "Blogs Found");
        } else {
            sendData = commonController.getErrorSendData({}, 404, {}, "Blogs not Found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const DELETE_BLOGS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const bodyData = data;
        console.log("bodyData: ", bodyData);
        const blogId = bodyData.id;
        console.log("blogId: ", blogId);

        const deletedBlogs = await deleteOne(
            "blogs",
            "id = $1",
            [blogId]
        );

        console.log("deletedBlogs: ", deletedBlogs);
        if (deletedBlogs) {
            sendData = commonController.getSuccessSendData(deletedBlogs, "Blogs Deleted Successfully");
        } else {
            sendData = commonController.getErrorSendData({}, 400, {}, "Blogs not Deleted");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_BLOGS = async (data: any, callback: (result: SendData) => void) => {
    let sendData = common.commonController.getSendData();
    try {
        const start = parseInt(data.start) || 1;
        const limit = parseInt(data.limit) || 10;
        const offset = (start - 1) * limit;

        const blogsList = await selectJoin(
            `SELECT * FROM blogs ORDER BY published_date DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await selectJoin(
            `SELECT COUNT(*) as count FROM blogs`,
            []
        ) as { count: string }[];

        const total_blogs = parseInt(countResult[0]?.count || "0");

        if (blogsList.length > 0) {
            const respData = common.paginationSetup({
                start,
                limit,
                numRows: total_blogs,
                currentRows: blogsList as object[],
            });
            respData.list = blogsList as object[];
            sendData["data"] = respData;

            sendData = common.commonController.getSuccessSendData(
                sendData.data,
                "Blogs List Found"
            );
        } else {
            sendData = common.commonController.getSuccessSendData(
                {},
                "Blogs List Does Not Found"
            );
        }
    } catch (err) {
        sendData = common.commonController.getErrorSendData(err);
    }
    callback(sendData);
};

export const LIST_CATEGORY = async (data: any, callback: (result: SendData) => void) => {
    let sendData = commonController.getSendData();
    try {
        const categories = await selectManyFields(
            "master_category",
            [
                "categoryid",
                "categoryname",
            ],
            "parent_id = 0",
            []
        );
        console.log("categories: ", categories);
        if (categories) {
            sendData = commonController.getSuccessSendData(categories, "Category list found");
        } else {
            sendData = commonController.getSuccessSendData([], "No categories found");
        }
    } catch (err) {
        sendData = commonController.getErrorSendData(err);
    }
    callback(sendData);
};