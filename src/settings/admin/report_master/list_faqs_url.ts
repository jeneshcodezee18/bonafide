import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/report/faqs", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Report FAQs List",
                config: config,
                script: {
                    available: 0,
                    js: "list_faqs",
                },
                css: {
                    available: 0,
                    css: "list_faqs",
                },
                menu: "list_faqs",
                data: {}
            };
            res.render("admin/report_master/list_faqs/list_faqs.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}