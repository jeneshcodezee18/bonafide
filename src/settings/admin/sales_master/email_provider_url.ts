import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/home_page/email_provider", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Email Providers",
                config: config,
                script: {
                    available: 0,
                    js: "email_provider",
                },
                css: {
                    available: 0,
                    css: "email_provider",
                },
                menu: "email_provider",
                data: {}
            };
            res.render("admin/sales_master/email_provider/email_provider.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}