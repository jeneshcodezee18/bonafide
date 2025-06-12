import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/services/addEdit/1", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Market Assessment",
                config: config,
                script: {
                    available: 0,
                    js: "market_assessment",
                },
                css: {
                    available: 0,
                    css: "market_assessment",
                },
                menu: "market_assessment",
                data: {}
            };
            res.render("admin/services/market_assessment/market_assessment.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}