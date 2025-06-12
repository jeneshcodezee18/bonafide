import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/services/addEdit/2", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Market Entry",  
                config: config,
                script: {
                    available: 0,
                    js: "market_entry",
                },
                css: {
                    available: 0,
                    css: "market_entry",
                },
                menu: "market_entry",
                data: {}
            };
            res.render("admin/services/market_entry/market_entry.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });
    
}