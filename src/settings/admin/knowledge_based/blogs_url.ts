import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from "express";
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";
import { validationResult } from "express-validator";
import { commonController } from "../../../controllers/admin/common/common";
import * as blogsController from "../../../controllers/admin/knowledge_based/blogs";
import * as apiJwtController from "../../../controllers/admin/jwt/jwt";

export function bindURL(): void {
  app.get(
    "/admin_master/blogs/manage",
    async function (req: Request, res: Response): Promise<void> {
      try {
        const respData: ResponseData = {
          base_url: BASE_URL ?? "",
          title: "Blogs List",
          config: config,
          script: {
            available: 1,
            js: "knowledge_based/blogs",
          },
          css: {
            available: 0,
            css: "blogs",
          },
          menu: "blogs",
          data: {},
        };
        res.render("admin/knowledge_based/blogs/blogs.html", respData);
      } catch (err: unknown) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.get(
    "/admin_master/blogs/addEdit",
    async function (req: Request, res: Response): Promise<void> {
      try {
        const respData: ResponseData = {
          base_url: BASE_URL ?? "",
          title: "Add Blogs",
          config: config,
          script: {
            available: 1,
            js: "knowledge_based/blogs",
          },
          css: {
            available: 0,
            css: "add_blogs",
          },
          menu: "add_blogs",
          data: {},
        };
        res.render("admin/knowledge_based/blogs/add_blogs.html", respData);
      } catch (err: unknown) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.post(
    "/admin_master/blogs/add",
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
              blogsController.ADD_BLOGS(data, function (respData) {
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
    "/admin_master/blogs/view",
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
              blogsController.VIEW_BLOGS(data, function (respData) {
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
    "/admin_master/blogs/delete",
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
              blogsController.DELETE_BLOGS(data, function (respData) {
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
    "/admin_master/blogs/list/:start/:limit",
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
              blogsController.LIST_BLOGS(data, function (respData) {
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
    "/admin_master/category/list",
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
              blogsController.LIST_CATEGORY(data, function (respData) {
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
