import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";
import { validationResult } from "express-validator";
import { commonController } from "../../../controllers/admin/common/common";
import * as didYouKnowImageController from "../../../controllers/admin/knowledge_based/did_you_know_image";
import * as apiJwtController from "../../../controllers/admin/jwt/jwt";


export function bindURL(): void {
    app.get("/admin_master/did_you_know/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Did You Know Image List",
                config: config,
                script: {
                    available: 1,
                    js: "knowledge_based/did_you_know_image",
                },
                css: {
                    available: 0,
                    css: "did_you_know",
                },
                menu: "did_you_know",
                data: {}
            };
            res.render("admin/knowledge_based/did_you_know/did_you_know.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get("/admin_master/did_you_know/addEdit", async function (req: Request, res: Response): Promise<void> {
            try {
                const respData: ResponseData = {
                    base_url: BASE_URL ?? "",
                    title: "Add Did You Know Image",
                    config: config,
                    script: {
                        available: 1,
                        js: "knowledge_based/did_you_know_image",
                    },
                    css: {
                        available: 0,
                        css: "add_did_you_know",
                    },
                    menu: "add_did_you_know",
                    data: {}
                };
                res.render("admin/knowledge_based/did_you_know/add_did_you_know.html", respData);
            } catch (err: unknown) {
                console.error(err);
                res.status(500).send("Internal Server Error");
            }
        });

    app.post("/admin_master/did_you_know/add", async function (req: Request, res: Response): Promise<void> {
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
                            didYouKnowImageController.ADD_DID_YOU_KNOW_IMAGE(data, function (respData) {
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

    app.post("/admin_master/did_you_know/view", async function (req: Request, res: Response): Promise<void> {
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
                            didYouKnowImageController.VIEW_DID_YOU_KNOW_IMAGE(data, function (respData) {
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

        app.post("/admin_master/did_you_know/delete", async function (req: Request, res: Response): Promise<void> {
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
                            didYouKnowImageController.DELETE_DID_YOU_KNOW_IMAGE(data, function (respData) {
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
    
        app.post("/admin_master/did_you_know/list/:start/:limit", async function (req: Request, res: Response): Promise<void> {
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
                            didYouKnowImageController.LIST_DID_YOU_KNOW_IMAGE(data, function (respData) {
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
