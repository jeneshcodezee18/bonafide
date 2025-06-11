// Ensure the correct path to your Express app instance
import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/report/report_analytics", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Report Analytics",
                config: config,
                script: {
                    available: 0,
                    js: "report_analytics",
                },
                css: {
                    available: 0,
                    css: "report_analytics",
                },
                menu: "report_analytics",
                data: {}
            };
            res.render("admin/report_master/report_analytics/report_analytics.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}