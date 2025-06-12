import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/services/data_collection", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Data Collection And Analysis",
                config: config,
                script: {
                    available: 0,
                    js: "data_collection",
                },
                css: {
                    available: 0,
                    css: "data_collection",
                },
                menu: "data_collection",
                data: {}
            };
            res.render("admin/services/data_collection/data_collection.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}