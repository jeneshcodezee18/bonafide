import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/report/upload", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Upload Report",
                config: config,
                script: {
                    available: 0,
                    js: "upload_report",
                },
                css: {
                    available: 0,
                    css: "upload_report",
                },
                menu: "upload_report",
                data: {}
            };
            res.render("admin/report_master/upload/upload.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}