import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";
import { requireAuth, requirePermission } from "../../../middleware/auth";
import { validationResult } from "express-validator";
import { commonController } from "../../../controllers/admin/common/common";
import * as apiJwtController from "../../../controllers/admin/jwt/jwt";
import * as salesMasterController from "../../../controllers/admin/sales_master/email_template";
export function bindURL(): void {
    app.get("/admin_master/email_template",
        requireAuth,
        requirePermission("sales_master"),
        async function (req: Request, res: Response): Promise<void> {
            try {
                const respData: ResponseData = {
                    base_url: BASE_URL ?? "",
                    title: "Email Template",
                    config: config,
                    script: {
                        available: 1,
                        js: "sales_master/email_template",
                    },
                    css: {
                        available: 0,
                        css: "email_template",
                    },
                    menu: "email_template",
                    data: {}
                };
                res.render("admin/sales_master/email_template/email_template.html", respData);
            } catch (err: unknown) {
                console.error(err); // Log the error for debugging purposes
                res.status(500).send("Internal Server Error");
            }
        });

    // Render add/edit page
    app.get("/admin_master/email_template/addEdit", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Add Email Template",
                config: config,
                script: {
                    available: 1,
                    js: "sales_master/email_template",
                },
                css: {
                    available: 0,
                    css: "email_template",
                },
                menu: "email_template",
                data: {}
            };
            res.render("admin/sales_master/email_template/add_email_template.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/admin_master/email_template/add", async function (req: Request, res: Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const respData = commonController.errorValidationResponse(errors);
                res.status(respData.status).send(respData);
            } else {
                //calling controller function
                apiJwtController.DECODE(req, (respData) => {
                    if (respData.status !== 200) {
                        res.status(respData.status).send(respData);
                    } else {
                        const data = req.body;
                        data.userData = respData.data;
                        salesMasterController.ADD_EMAIL_TEMPLATE(data, function (respData) {
                            res.status(respData.status).send(respData);
                        });
                    }
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/admin_master/email_template/view", async function (req: Request, res: Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const respData = commonController.errorValidationResponse(errors);
                res.status(respData.status).send(respData);
            } else {
                apiJwtController.DECODE(req, (respData) => {
                    if (respData.status !== 200) {
                        res.status(respData.status).send(respData);
                    } else {
                        const data = req.body;
                        data.userData = respData.data;
                        salesMasterController.VIEW_EMAIL_TEMPLATE(data, function (respData) {
                            res.status(respData.status).send(respData);
                        });
                    }
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/admin_master/email_template/delete", async function (req: Request, res: Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const respData = commonController.errorValidationResponse(errors);
                res.status(respData.status).send(respData);
            } else {
                apiJwtController.DECODE(req, (respData) => {
                    if (respData.status !== 200) {
                        res.status(respData.status).send(respData);
                    } else {
                        const data = req.body;
                        data.userData = respData.data;
                        salesMasterController.DELETE_EMAIL_TEMPLATE(data, function (respData) {
                            res.status(respData.status).send(respData);
                        });
                    }
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/admin_master/email_template/list/:start/:limit", async function (req: Request, res: Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const respData = commonController.errorValidationResponse(errors);
                res.status(respData.status).send(respData);
            } else {
                apiJwtController.DECODE(req, (respData) => {
                    if (respData.status !== 200) {
                        res.status(respData.status).send(respData);
                    } else {
                        const { start, limit } = req.params;
                        const data = req.body;
                        data.userData = respData.data;
                        data.start = start;
                        data.limit = limit;
                        salesMasterController.LIST_EMAIL_TEMPLATES(data, function (respData) {
                            res.status(respData.status).send(respData);
                        });
                    }
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
}