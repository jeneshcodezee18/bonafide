import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/website_pages/custom_report", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Custom Report",
                config: config,
                script: {
                    available: 0,
                    js: "custom_report",
                },
                css: {
                    available: 0,
                    css: "custom_report",
                },
                menu: "custom_report",
                data: {}
            };
            res.render("admin/services/custom_report/custom_report.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}