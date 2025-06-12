import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/services/addEdit/3", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Benchmarking",
                config: config,
                script: {
                    available: 0,
                    js: "benchmarking",
                },
                css: {
                    available: 0,
                    css: "benchmarking",
                },
                menu: "benchmarking",
                data: {}
            };
            res.render("admin/services/benchmarking/benchmarking.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });
    
}