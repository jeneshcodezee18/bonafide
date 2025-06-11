import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/site_config/sitemap", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Sitemap",
                config: config,
                script: {
                    available: 0,
                    js: "sitemap",
                },
                css: {
                    available: 0,
                    css: "sitemap",
                },
                menu: "sitemap",
                data: {}
            };
            res.render("admin/report_master/sitemap/sitemap.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}