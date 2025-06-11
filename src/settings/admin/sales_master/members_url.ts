import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/home_page/network_of_field_surveyors_list", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Network of Field Surveyors Member List",
                config: config,
                script: {
                    available: 0,
                    js: "members",
                },
                css: {
                    available: 0,
                    css: "members",
                },
                menu: "members",
                data: {}
            };
            res.render("admin/sales_master/members/members.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}