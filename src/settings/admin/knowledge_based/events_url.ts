import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/events/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Events List",
                config: config,
                script: {
                    available: 0,
                    js: "events",
                },
                css: {
                    available: 0,
                    css: "events",
                },
                menu: "events",
                data: {}
            };
            res.render("admin/knowledge_based/events/events.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}
