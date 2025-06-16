import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";
import { validationResult } from "express-validator";
import * as careerMasterController from "../../../controllers/admin/career_master/career_master";
import * as apiJwtController from "../../../controllers/admin/jwt/jwt";
import { commonController } from "../../../controllers/admin/common/common";

export function bindURL(): void {
    app.get("/admin_master/career_jobs/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Career List",
                config: config,
                script: {
                    available: 1,
                    js: "career_master/career_list",
                },
                css: {
                    available: 0,
                    css: "career_list",
                },
                menu: "career_list",
                data: {}
            };
            res.render("admin/career_master/jobs/jobs.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get("/admin_master/career_jobs/addEdit", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Add Career Jobs",
                config: config,
                script: {
                    available: 1,
                    js: "career_master/career_list",
                },
                css: {
                    available: 0,
                    css: "add_job",
                },
                menu: "add_job",
                data: {}
            };
            res.render("admin/career_master/jobs/add_job.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/admin_master/career_jobs/add", async function (req: Request, res: Response): Promise<void> {
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
                        careerMasterController.ADD_JOB(data, function (respData) {
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

    app.post("/admin_master/career_jobs/view", async function (req: Request, res: Response): Promise<void> {
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
                        careerMasterController.VIEW_JOB(data, function (respData) {
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

    app.post("/admin_master/career_jobs/delete", async function (req: Request, res: Response): Promise<void> {
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
                        careerMasterController.DELETE_JOB(data, function (respData) {
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

    app.post("/admin_master/career_jobs/list/:start/:limit", async function (req: Request, res: Response): Promise<void> {
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
                        careerMasterController.LIST_JOB(data, function (respData) {
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

    app.get("/admin_master/career_jobs/:career_jobsid", function (req, res) {
        try {
            const { career_jobsid } = req.params;
            careerMasterController.VIEW_JOB({ career_jobsid }, function (service) {
                const respData = {
                    base_url: BASE_URL,
                    title: 'Career Job Details',
                    config: config,
                    script: {
                        available: 0,
                        js: "career_master/career_list",
                    },
                    css: {
                        available: 0,
                        css: "career_list",
                    },
                    menu: "career_list",
                    data: service.data
                };

                res.render("admin/career_master/jobs/job_view.html", respData);
            });
        } catch (err) {
            res.status(404).send(err);
        }
    });

}
