import app from "../../app"; 
import * as config from "../../../config.json";
import { Request, Response } from 'express';
import { ResponseData } from "../../types/common";
import { BASE_URL } from "../../util/secrets";
import { validationResult } from "express-validator";
import { commonController } from "../../controllers/common";
import * as loginController from "../../controllers/admin/login";


export function bindURL(): void {
    app.get("/admin_master", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                 base_url: BASE_URL ?? "",
                title: "Login",
                config: config,
                script: {
                    available: 0,
                    js: "login ",
                },
                css: {
                    available: 0,
                    css: "login",
                },
                menu: "login",
                data: {}
            };
            res.render("admin/login/login.html", respData);
        } catch (err: unknown) {
            console.error(err); // Log the error for debugging purposes
            res.status(500).send("Internal Server Error");
        }
    });

    app.post('/admin_master/login', async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const respData = commonController.errorValidationResponse(errors);
                res.status(respData.status).send(respData);
            } else {
                //calling controller function
                const data = await req.body;
                loginController.LOGIN(data, function (respData) {
                    res.status(respData.status).send(respData);
                })
            }
        } catch (err) {
            console.log(err)
            const respData = commonController.errorValidationResponse(err); 
            res.status(respData.status).send(respData);
        }
    });
}
   

