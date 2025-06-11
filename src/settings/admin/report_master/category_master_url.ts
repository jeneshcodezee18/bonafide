import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/category/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Category List",
                config: config,
                script: {
                    available: 0,
                    js: "list_category",
                },
                css: {
                    available: 0,
                    css: "list_category",
                },
                menu: "list_category",
                data: {}
            };
            res.render("admin/report_master/category_master/category_master.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}