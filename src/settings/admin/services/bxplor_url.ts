import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/services/bxplor_market_research_reports", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Bxplor",  
                config: config,
                script: {
                    available: 0,
                    js: "bxplor",
                },
                css: {
                    available: 0,
                    css: "bxplor",
                },
                menu: "bxplor",
                data: {}
            };
            res.render("admin/services/bxplor/bxplor.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });
    
}