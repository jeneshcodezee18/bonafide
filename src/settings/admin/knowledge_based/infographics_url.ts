import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/infographics/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Infographics Image List",
                config: config,
                script: {
                    available: 0,
                    js: "infographics",
                },
                css: {
                    available: 0,
                    css: "infographics",
                },
                menu: "infographics",
                data: {}
            };
            res.render("admin/knowledge_based/infographics/infographics.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}
