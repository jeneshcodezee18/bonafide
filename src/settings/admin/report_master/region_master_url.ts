import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/region_master/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Region Master",
                config: config,
                script: {
                    available: 0,
                    js: "region_master",
                },
                css: {
                    available: 0,
                    css: "region_master",
                },
                menu: "region_master",
                data: {}
            };
            res.render("admin/report_master/region_master/region_master.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}