import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/page_slider/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Page Slider List",  
                config: config,
                script: {
                    available: 0,
                    js: "slider_list",
                },
                css: {
                    available: 0,
                    css: "slider_list",
                },
                menu: "slider_list",
                data: {}
            };
            res.render("admin/super_admin/slider_list/slider_list.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}
