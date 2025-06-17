import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";
import { requireAuth, requirePermission } from "../../../middleware/auth";
import { validationResult } from "express-validator";
import { commonController } from "../../../controllers/admin/common/common";
import * as apiJwtController from "../../../controllers/admin/jwt/jwt";
import * as salesMasterController from "../../../controllers/admin/sales_master/our_client";

export function bindURL(): void {
    app.get("/admin_master/home_page/our_client_list",
        requireAuth,
        requirePermission("sales_master"),
        async function (req: Request, res: Response): Promise<void> {
            try {
                const respData: ResponseData = {
                    base_url: BASE_URL ?? "",
                    title: "Our client list",
                    config: config,
                    script: {
                        available: 1,
                        js: "sales_master/our_client",
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

    app.get("/admin_master/home_page/our_client_addEdit", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Our client list",
                config: config,
                script: {
                    available: 1,
                    js: "sales_master/our_client",
                },
                css: {
                    available: 0,
                    css: "our_client",
                },
                menu: "our_client",
                data: {}
            };
            res.render("admin/sales_master/our_client/add_our_client.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

        app.post("/admin_master/our_client/add", async function (req: Request, res: Response): Promise<void> {
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
                            salesMasterController.ADD_CLIENT(data, function (respData) {
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
    
        app.post("/admin_master/our_client/view", async function (req: Request, res: Response): Promise<void> {
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
                            salesMasterController.VIEW_CLIENT(data, function (respData) {
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
    
        app.post("/admin_master/our_client/delete", async function (req: Request, res: Response): Promise<void> {
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
                            salesMasterController.DELETE_CLIENT(data, function (respData) {
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
    
        app.post("/admin_master/our_client/list/:start/:limit", async function (req: Request, res: Response): Promise<void> {
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
                            salesMasterController.LIST_CLIENTS(data, function (respData) {
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

        app.post("/admin_master/category/list", async function (req: Request, res: Response): Promise<void> {
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
                            salesMasterController.LIST_CATEGORY(data, function (respData) {
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

        app.post("/admin_master/subcategory/list", async function (req: Request, res: Response): Promise<void> {
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
                            salesMasterController.LIST_SUBCATEGORY(data, function (respData) {
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