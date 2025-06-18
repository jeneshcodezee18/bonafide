import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";
import { requireAuth, requirePermission } from "../../../middleware/auth";
import { validationResult } from "express-validator";
import { commonController } from "../../../controllers/admin/common/common";
import * as apiJwtController from "../../../controllers/admin/jwt/jwt";
import * as salesMasterController from "../../../controllers/admin/sales_master/lead_master";
export function bindURL(): void {
    app.get("/admin_master/report/lead_master",
        requireAuth,
        requirePermission("sales_master"),
        async function (req: Request, res: Response): Promise<void> {
            try {
                const respData: ResponseData = {
                    base_url: BASE_URL ?? "",
                    title: "Lead Master",
                    config: config,
                    script: {
                        available: 1,
                        js: "sales_master/lead_master",
                    },
                    css: {
                        available: 0,
                        css: "lead_master",
                    },
                    menu: "lead_master",
                    data: {}
                };
                res.render("admin/sales_master/lead_master/lead_master.html", respData);
            } catch (err: unknown) {
                console.error(err); // Log the error for debugging purposes
                res.status(500).send("Internal Server Error");
            }
        });
    
        app.get("/admin_master/report/lead_master_addedit", async function (req: Request, res: Response): Promise<void> {
            try {
                const respData: ResponseData = {
                    base_url: BASE_URL ?? "",
                    title: "Add Lead Master",
                    config: config,
                    script: {
                        available: 1,
                        js: "sales_master/lead_master",
                    },
                    css: {
                        available: 0,
                        css: "lead_master",
                    },
                    menu: "lead_master",
                    data: {}
                };
                res.render("admin/sales_master/lead_master/add_lead_master.html", respData);
            } catch (err: unknown) {
                console.error(err);
                res.status(500).send("Internal Server Error");
            }
        });
    
        app.post("/admin_master/lead_master/add", async function (req: Request, res: Response): Promise<void> {
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
                            salesMasterController.ADD_LEAD(data, function (respData) {
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
    
        app.post("/admin_master/lead_master/view", async function (req: Request, res: Response): Promise<void> {
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
                            salesMasterController.VIEW_LEAD(data, function (respData) {
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
    
        app.post("/admin_master/lead_master/delete", async function (req: Request, res: Response): Promise<void> {
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
                            salesMasterController.DELETE_LEAD(data, function (respData) {
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
    
        app.post("/admin_master/lead_master/list/:start/:limit", async function (req: Request, res: Response): Promise<void> {
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
                            salesMasterController.LIST_LEADS(data, function (respData) {
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

        app.post("/admin_master/assigned_members/list", async function (req: Request, res: Response): Promise<void> {
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
                            salesMasterController.LIST_ASSIGNED_MEMBERS(data, function (respData) {
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