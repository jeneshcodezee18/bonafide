import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/news/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "News List",
                config: config,
                script: {
                    available: 0,
                    js: "news",
                },
                css: {
                    available: 0,
                    css: "news",
                },
                menu: "news",
                data: {}
            };
            res.render("admin/knowledge_based/news/news.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}
