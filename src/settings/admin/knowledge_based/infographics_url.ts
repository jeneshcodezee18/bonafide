import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";
import * as infographicsController from "../../../controllers/admin/knowledge_based/infographics";
import * as apiJwtController from "../../../controllers/admin/jwt/jwt";
import { validationResult } from "express-validator";
import { commonController } from "../../../controllers/admin/common/common";

export function bindURL(): void {
    app.get("/admin_master/infographics/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Infographics Image List",
                config: config,
                script: {
                    available: 1,
                    js: "knowledge_based/infographics",
                },
                css: {
                    available: 0,
                    css: "infographics",
                },
                menu: "infographics",
                data: {}
            };
            res.render("admin/knowledge_based/infographics/infographics.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get("/admin_master/infographics/addEdit", async function (req: Request, res: Response): Promise<void> {
            try {
                const respData: ResponseData = {
                    base_url: BASE_URL ?? "",
                    title: "Add Infographics Image",
                    config: config,
                    script: {
                        available: 1,
                        js: "knowledge_based/infographics",
                    },
                    css: {
                        available: 0,
                        css: "add_infographics",
                    },
                    menu: "add_infographics",
                    data: {}
                };
                res.render("admin/knowledge_based/infographics/add_infographics.html", respData);
            } catch (err: unknown) {
                console.error(err);
                res.status(500).send("Internal Server Error");
            }
        });

    app.post("/admin_master/infographics/add", async function (req: Request, res: Response): Promise<void> {
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
                            infographicsController.ADD_INFOGRAPHICS(data, function (respData) {
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

    app.post("/admin_master/infographics/view", async function (req: Request, res: Response): Promise<void> {
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
                            infographicsController.VIEW_INFOGRAPHICS(data, function (respData) {
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

        app.post("/admin_master/infographics/delete", async function (req: Request, res: Response): Promise<void> {
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
                            infographicsController.DELETE_INFOGRAPHICS(data, function (respData) {
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
    
        app.post("/admin_master/infographics/list/:start/:limit", async function (req: Request, res: Response): Promise<void> {
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
                            infographicsController.LIST_INFOGRAPHICS(data, function (respData) {
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
                                infographicsController.LIST_CATEGORY(data, function (respData) {
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
