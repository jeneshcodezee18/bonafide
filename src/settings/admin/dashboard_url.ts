import app from "../../app"; 
import * as config from "../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../types/common";
import { BASE_URL } from "../../util/secrets";
import { requireAuth, requirePermission } from "../../middleware/auth";



export function bindURL(): void {
    app.get("/admin_master/adminHome",
        requireAuth,
        requirePermission("dashboard"),
        async function (req: Request, res: Response): Promise<void> {
            try {
                const respData: ResponseData = {
                    base_url: BASE_URL ?? "",
                    title: "Dashboard",
                    config: config,
                    script: {
                        available: 0,
                        js: "dashboard",
                    },
                    css: {
                        available: 0,
                        css: "dashboard",
                    },
                    menu: "dashboard",
                    data: {},
                    userData: req.userData 
                };
                res.render("admin/dashboard/dashboard.html", respData);
            } catch (err: unknown) {
                console.error(err);
                res.status(500).send("Internal Server Error");
            }
        }
    );
}


