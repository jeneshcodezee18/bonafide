import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/Database/manage/career", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Career Database",  
                config: config,
                script: {
                    available: 0,
                    js: "career_database",
                },
                css: {
                    available: 0,
                    css: "career_database",
                },
                menu: "career_database",
                data: {}
            };
            res.render("admin/career_master/database/database.html", respData);
        } catch (err: unknown) {
            console.error(err); 
            res.status(500).send("Internal Server Error");
        }
    });
}
