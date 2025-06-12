import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/Database/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Table List",  
                config: config,
                script: {
                    available: 0,
                    js: "superadmin_database",
                },
                css: {
                    available: 0,
                    css: "superadmin_database",
                },
                menu: "superadmin_database",
                data: {}
            };
            res.render("admin/super_admin/database/database.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}
