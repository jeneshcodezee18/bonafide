import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/press_releases/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Press Releases List", 
                config: config,
                script: {
                    available: 0,
                    js: "press_releases_list",
                },
                css: {
                    available: 0,
                    css: "press_releases_list",
                },
                menu: "press_releases_list",
                data: {}
            };
            res.render("admin/report_master/list_pr/list_pr.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}