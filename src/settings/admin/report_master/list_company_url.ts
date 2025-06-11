import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/company_master/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Company List",
                config: config,
                script: {
                    available: 0,
                    js: "company_list",
                },
                css: {
                    available: 0,
                    css: "company_list",
                },
                menu: "company_list",
                data: {}
            };
            res.render("admin/report_master/list_company/list_company.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}