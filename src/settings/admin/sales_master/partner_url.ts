import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/partner_list/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Partner List",
                config: config,
                script: {
                    available: 0,
                    js: "partner",
                },
                css: {
                    available: 0,
                    css: "partner",
                },
                menu: "partner",
                data: {}
            };
            res.render("admin/sales_master/partner/partner.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}