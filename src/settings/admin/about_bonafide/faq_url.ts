import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/faqs/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "FAQs",
                config: config,
                script: {
                    available: 0,
                    js: "faqs_manage",
                },
                css: {
                    available: 0,
                    css: "faqs_manage",
                },
                menu: "faqs_manage",
                data: {}
            };
            res.render("admin/about_bonafide/faq/faq.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}
