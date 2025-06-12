import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/website_pages/license_information", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "License Information",
                config: config,
                script: {
                    available: 0,
                    js: "license_information",
                },
                css: {
                    available: 0,
                    css: "license_information",
                },
                menu: "license_information",
                data: {}
            };
            res.render("admin/about_bonafide/license_info/license_info.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}