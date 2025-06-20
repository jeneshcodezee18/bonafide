import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/website_pages/about_page", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "About Us",  
                config: config,
                script: {
                    available: 1,
                    js: "about_bonafide/about_us",
                },
                css: {
                    available: 0,
                    css: "about_us",
                },
                menu: "about_us",
                data: {}
            };
            res.render("admin/about_bonafide/about_us/about_us.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });
    
}