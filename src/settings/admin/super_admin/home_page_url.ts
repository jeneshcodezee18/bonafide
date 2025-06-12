import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/home_page/home_setting", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Home Setting",  
                config: config,
                script: {
                    available: 0,
                    js: "home_page",
                },
                css: {
                    available: 0,
                    css: "home_page",
                },
                menu: "home_page",
                data: {}
            };
            res.render("admin/super_admin/home_page/home_page.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}
