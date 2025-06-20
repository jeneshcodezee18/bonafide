import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";
import { requireAuth, requirePermission } from "../../../middleware/auth";
import { validationResult } from "express-validator";
import { commonController } from "../../../controllers/admin/common/common";
import * as apiJwtController from "../../../controllers/admin/jwt/jwt";
import * as salesMasterController from "../../../controllers/admin/sales_master/discount_coupon";

export function bindURL(): void {
    app.get("/admin_master/coupon_master/manage",
        requireAuth,
        requirePermission("sales_master"),
        async function (req: Request, res: Response): Promise<void> {
            try {
                const respData: ResponseData = {
                    base_url: BASE_URL ?? "",
                    title: "Coupon List",
                    config: config,
                    script: {
                        available: 1,
                        js: "sales_master/discount_coupon",
                    },
                    css: {
                        available: 0,
                        css: "discount_coupon",
                    },
                    menu: "discount_coupon",
                    data: {}
                };
                res.render("admin/sales_master/discount_coupon/discount_coupon.html", respData);
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
                    js: "sales_master/discount_coupon",
                },
                css: {
                    available: 0,
                    css: "discount_coupon",
                },
                menu: "discount_coupon",
                data: {}
            };
            res.render("admin/sales_master/discount_coupon/add_discount_coupon.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/admin_master/discount_coupon/add", async function (req: Request, res: Response): Promise<void> {
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
                        salesMasterController.ADD_COUPON(data, function (respData) {
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

    app.post("/admin_master/discount_coupon/view", async function (req: Request, res: Response): Promise<void> {
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
                        salesMasterController.VIEW_COUPON(data, function (respData) {
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

    app.post("/admin_master/discount_coupon/delete", async function (req: Request, res: Response): Promise<void> {
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
                        salesMasterController.DELETE_COUPON(data, function (respData) {
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

    app.post("/admin_master/discount_coupon/list/:start/:limit", async function (req: Request, res: Response): Promise<void> {
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
                        salesMasterController.LIST_COUPONS(data, function (respData) {
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

    app.post("/admin_master/all_publisher/list", async function (req: Request, res: Response): Promise<void> {
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
                        salesMasterController.LIST_ALL_PUBLISHER(data, function (respData) {
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

    app.post("/admin_master/all_region/list", async function (req: Request, res: Response): Promise<void> {
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
                        salesMasterController.LIST_ALL_REGION(data, function (respData) {
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

    app.post("/admin_master/all_country/list", async function (req: Request, res: Response): Promise<void> {
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
                        salesMasterController.LIST_ALL_COUNTRY(data, function (respData) {
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