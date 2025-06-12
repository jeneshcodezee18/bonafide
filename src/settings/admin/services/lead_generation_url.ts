import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/services/lead_generation", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Lead Generation",  
                config: config,
                script: {
                    available: 0,
                    js: "lead_generation",
                },
                css: {
                    available: 0,
                    css: "lead_generation",
                },
                menu: "lead_generation",
                data: {}
            };
            res.render("admin/services/lead_generation/lead_generation.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });
    
}