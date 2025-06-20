import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";
import { requireAuth, requirePermission } from "../../../middleware/auth";
import { validationResult } from "express-validator";
import { commonController } from "../../../controllers/admin/common/common";
import * as apiJwtController from "../../../controllers/admin/jwt/jwt";
import * as salesMasterController from "../../../controllers/admin/sales_master/report_promotion";

export function bindURL(): void {
    app.get("/admin_master/report/report_promotion",
        requireAuth,
        requirePermission("sales_master"),
        async function (req: Request, res: Response): Promise<void> {
            try {
                const respData: ResponseData = {
                    base_url: BASE_URL ?? "",
                    title: "Report Promotion",
                    config: config,
                    script: {
                        available: 1,
                        js: "sales_master/report_promotion",
                    },
                    css: {
                        available: 0,
                        css: "report_promotion",
                    },
                    menu: "report_promotion",
                    data: {}
                };
                res.render("admin/sales_master/report_promotion/report_promotion.html", respData);
            } catch (err: unknown) {
                console.error(err); // Log the error for debugging purposes
                res.status(500).send("Internal Server Error");
            }
        });

    app.get("/admin_master/coupon_master/add_filter", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Add Coupon",
                config: config,
                script: {
                    available: 1,
                    js: "sales_master/report_promotion",
                },
                css: {
                    available: 0,
                    css: "report_promotion",
                },
                menu: "report_promotion",
                data: {}
            };
            res.render("admin/sales_master/report_promotion/add_report_promotion.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/admin_master/report_promotion/add", async function (req: Request, res: Response): Promise<void> {
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
                        salesMasterController.ADD_REPORT_PROMOTIONAL(data, function (respData) {
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

    app.post("/admin_master/report_promotion/view", async function (req: Request, res: Response): Promise<void> {
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
                        salesMasterController.VIEW_REPORT_PROMOTIONAL(data, function (respData) {
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

    app.post("/admin_master/report_promotion/delete", async function (req: Request, res: Response): Promise<void> {
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
                        salesMasterController.DELETE_REPORT_PROMOTIONAL(data, function (respData) {
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

    app.post("/admin_master/report_promotion/list/:start/:limit", async function (req: Request, res: Response): Promise<void> {
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
                        salesMasterController.LIST_REPORT_PROMOTIONAL(data, function (respData) {
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

    app.post("/admin_master/all_category/list", async function (req: Request, res: Response): Promise<void> {
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