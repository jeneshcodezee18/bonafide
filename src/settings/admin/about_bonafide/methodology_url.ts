import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/website_pages/methodology", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Methodology",
                config: config,
                script: { 
                    available: 0,
                    js: "methodology" 
                },
                css: { 
                    available: 0, 
                    css: "methodology" 
                },
                menu: "methodology",
                data: {}
            };
            res.render("admin/about_bonafide/methodology/methodology.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

}