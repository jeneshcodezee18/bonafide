import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/report/list_segment", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "List Segment",
                config: config,
                script: {
                    available: 0,
                    js: "list_segment",
                },
                css: {
                    available: 0,
                    css: "list_segment",
                },
                menu: "list_segment",
                data: {}
            };
            res.render("admin/report_master/list_segment/list_segment.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}