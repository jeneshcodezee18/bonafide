import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
    app.get("/admin_master/report/segment_graph_list", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "List Segment Graph",
                config: config,
                script: {
                    available: 0,
                    js: "list_segment_graph",
                },
                css: {
                    available: 0,
                    css: "list_segment_graph",
                },
                menu: "list_segment_graph",
                data: {}
            };
            res.render("admin/report_master/list_segment_graph/list_segment_graph.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

}