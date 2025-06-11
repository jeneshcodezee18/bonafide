import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/report/product_banner", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Product Banner",
                config: config,
                script: {
                    available: 0,
                    js: "product_banner",
                },
                css: {
                    available: 0,
                    css: "product_banner",
                },
                menu: "product_banner",
                data: {}
            };
            res.render("admin/report_master/product_banner/product_banner.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}