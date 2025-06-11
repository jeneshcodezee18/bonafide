import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/quotation/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Quotation List",
                config: config,
                script: {
                    available: 0,
                    js: "quotation",
                },
                css: {
                    available: 0,
                    css: "quotation",
                },
                menu: "quotation",
                data: {}
            };
            res.render("admin/sales_master/quotation/quotation.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}