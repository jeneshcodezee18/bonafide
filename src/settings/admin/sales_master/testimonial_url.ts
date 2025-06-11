import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/testimonial/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Testimonial List",
                config: config,
                script: {
                    available: 0,
                    js: "testimonial",
                },
                css: {
                    available: 0,
                    css: "testimonial",
                },
                menu: "testimonial",
                data: {}
            };
            res.render("admin/sales_master/testimonial/testimonial.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}