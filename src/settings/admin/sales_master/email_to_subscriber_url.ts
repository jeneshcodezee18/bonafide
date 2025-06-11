import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/Subscriber_email/manage_product", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Email to Subscriber",
                config: config,
                script: {
                    available: 0,
                    js: "email_to_subscriber",
                },
                css: {
                    available: 0,
                    css: "email_to_subscriber",
                },
                menu: "email_to_subscriber",
                data: {}
            };
            res.render("admin/sales_master/email_to_subscriber/email_to_subscriber.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}