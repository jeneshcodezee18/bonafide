import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/report/sales_tracking", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Sales Tracking",
                config: config,
                script: {
                    available: 0,
                    js: "sales_tracking",
                },
                css: {
                    available: 0,
                    css: "sales_tracking",
                },
                menu: "sales_tracking",
                data: {}
            };
            res.render("admin/sales_master/sales_tracking/sales_tracking.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}