import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/site_config", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Site Config",  
                config: config,
                script: {
                    available: 0,
                    js: "page_headings",
                },
                css: {
                    available: 0,
                    css: "page_headings",
                },
                menu: "page_headings",
                data: {}
            };
            res.render("admin/super_admin/page_headings/page_headings.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}
