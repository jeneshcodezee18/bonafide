import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/admin_user/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Admin User",  
                config: config,
                script: {
                    available: 0,
                    js: "admin_user",
                },
                css: {
                    available: 0,
                    css: "admin_user",
                },
                menu: "admin_user",
                data: {}
            };
            res.render("admin/super_admin/admin_user/admin_user.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}
