import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/website_pages/sample_request", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Sample Request",
                config: config,
                script: {
                    available: 0,
                    js: "sample_request",
                },
                css: {
                    available: 0,
                    css: "sample_request",
                },
                menu: "sample_request",
                data: {}
            };
            res.render("admin/about_bonafide/forms/forms.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}
