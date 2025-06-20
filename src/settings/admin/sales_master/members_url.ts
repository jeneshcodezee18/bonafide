import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from "express";
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";
import { requireAuth, requirePermission } from "../../../middleware/auth";
import { validationResult } from "express-validator";
import { commonController } from "../../../controllers/admin/common/common";
import * as apiJwtController from "../../../controllers/admin/jwt/jwt";
import * as salesMasterController from "../../../controllers/admin/sales_master/members";

export function bindURL(): void {
  app.get(
    "/admin_master/home_page/network_of_field_surveyors_list",
    requireAuth,
    requirePermission("sales_master"),
    async function (req: Request, res: Response): Promise<void> {
      try {
        const respData: ResponseData = {
          base_url: BASE_URL ?? "",
          title: "Network of Field Surveyors Member List",
          config: config,
          script: {
            available: 1,
            js: "sales_master/member",
          },
          css: {
            available: 0,
            css: "members",
          },
          menu: "members",
          data: {},
        };
        res.render("admin/sales_master/members/members.html", respData);
      } catch (err: unknown) {
        console.error(err); // Log the error for debugging purposes
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.get(
    "/admin_master/home_page/network_of_field_surveyors_list_addEdit",
    async function (req: Request, res: Response): Promise<void> {
      try {
        const respData: ResponseData = {
          base_url: BASE_URL ?? "",
          title: "Add Member",
          config: config,
          script: {
            available: 1,
            js: "sales_master/member",
          },
          css: {
            available: 0,
            css: "add_member",
          },
          menu: "add_member",
          data: {},
        };
        res.render("admin/sales_master/members/add_member.html", respData);
      } catch (err: unknown) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.post(
    "/admin_master/member/add",
    async function (req: Request, res: Response): Promise<void> {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const respData = commonController.errorValidationResponse(errors);
          res.status(respData.status).send(respData);
        } else {
          //calling controller function
          apiJwtController.DECODE(req, (respData: any) => {
            if (respData.status !== 200) {
              res.status(respData.status).send(respData);
            } else {
              const data = req.body;
              data.userData = respData.data;
              salesMasterController.ADD_MEMBER(data, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.post(
    "/admin_master/member/view",
    async function (req: Request, res: Response): Promise<void> {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const respData = commonController.errorValidationResponse(errors);
          res.status(respData.status).send(respData);
        } else {
          apiJwtController.DECODE(req, (respData: any) => {
            if (respData.status !== 200) {
              res.status(respData.status).send(respData);
            } else {
              const data = req.body;
              data.userData = respData.data;
              salesMasterController.VIEW_MEMBER(data, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.post(
    "/admin_master/member/delete",
    async function (req: Request, res: Response): Promise<void> {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const respData = commonController.errorValidationResponse(errors);
          res.status(respData.status).send(respData);
        } else {
          apiJwtController.DECODE(req, (respData: any) => {
            if (respData.status !== 200) {
              res.status(respData.status).send(respData);
            } else {
              const data = req.body;
              data.userData = respData.data;
              salesMasterController.DELETE_MEMBER(data, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.post(
    "/admin_master/member/list/:start/:limit",
    async function (req: Request, res: Response): Promise<void> {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const respData = commonController.errorValidationResponse(errors);
          res.status(respData.status).send(respData);
        } else {
          apiJwtController.DECODE(req, (respData: any) => {
            if (respData.status !== 200) {
              res.status(respData.status).send(respData);
            } else {
              const { start, limit } = req.params;
              const data = req.body;
              data.userData = respData.data;
              data.start = start;
              data.limit = limit;
              salesMasterController.LIST_MEMBERS(data, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );
}
