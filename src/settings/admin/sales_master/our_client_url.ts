import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/home_page/our_client_list", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Our client list",
                config: config,
                script: {
                    available: 0,
                    js: "our_client",
                },
                css: {
                    available: 0,
                    css: "our_client",
                },
                menu: "our_client",
                data: {}
            };
            res.render("admin/sales_master/our_client/our_client.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}