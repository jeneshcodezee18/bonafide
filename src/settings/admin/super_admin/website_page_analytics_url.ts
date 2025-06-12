import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/report/website_page_analytics", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Website Page Analytics",  
                config: config,
                script: {
                    available: 0,
                    js: "website_page_analytics",
                },
                css: {
                    available: 0,
                    css: "website_page_analytics",
                },
                menu: "website_page_analytics",
                data: {}
            };
            res.render("admin/super_admin/website_page_analytics/website_page_analytics.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}
