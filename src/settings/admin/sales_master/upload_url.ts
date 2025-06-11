import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/report/upload_sales", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Upload Sales",
                config: config,
                script: {
                    available: 0,
                    js: "upload_sales",
                },
                css: {
                    available: 0,
                    css: "upload_sales",
                },
                menu: "upload_sales",
                data: {}
            };
            res.render("admin/sales_master/upload_sales/upload_sales.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}