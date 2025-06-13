import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/website_pages/career", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Career us",  
                config: config,
                script: {
                    available: 0,
                    js: "career_us",
                },
                css: {
                    available: 0,
                    css: "career_us",
                },
                menu: "career_us",
                data: {}
            };
            res.render("admin/career_master/career/career.html", respData);
        } catch (err: unknown) {
            console.error(err); 
            res.status(500).send("Internal Server Error");
        }
    });
}
