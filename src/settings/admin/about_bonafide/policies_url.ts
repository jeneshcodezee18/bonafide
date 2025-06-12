import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/website_pages/policies", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Policies",
                config: config,
                script: {
                    available: 0,
                    js: "policies",
                },
                css: {
                    available: 0,
                    css: "policies",
                },
                menu: "policies",
                data: {}
            };
            res.render("admin/about_bonafide/policies/policies.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}