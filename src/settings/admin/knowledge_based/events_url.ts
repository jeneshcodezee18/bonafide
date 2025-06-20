import app from "../../../app";
import * as config from "../../../../config.json";
import { Request, Response } from "express";
import { ResponseData } from "../../../types/common";
import { BASE_URL } from "../../../util/secrets";

export function bindURL(): void {
<<<<<<< Updated upstream
    app.get("/admin_master/events/manage", async function (req: Request, res: Response): Promise<void> {
        try {
            const respData: ResponseData = {
                base_url: BASE_URL ?? "",
                title: "Events List",
                config: config,
                script: {
                    available: 0,
                    js: "events",
                },
                css: {
                    available: 0,
                    css: "events",
                },
                menu: "events",
                data: {}
            };
            res.render("admin/knowledge_based/events/events.html", respData);
        } catch (err: unknown) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
=======
  app.get(
    "/admin_master/events/manage",
    async function (req: Request, res: Response): Promise<void> {
      try {
        const respData: ResponseData = {
          base_url: BASE_URL ?? "",
          title: "Events List",
          config: config,
          script: {
            available: 1,
            js: "knowledge_based/events",
          },
          css: {
            available: 0,
            css: "events",
          },
          menu: "events",
          data: {},
        };
        res.render("admin/knowledge_based/events/events.html", respData);
      } catch (err: unknown) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.get(
    "/admin_master/events/addEdit",
    async function (req: Request, res: Response): Promise<void> {
      try {
        const respData: ResponseData = {
          base_url: BASE_URL ?? "",
          title: "Add Events",
          config: config,
          script: {
            available: 1,
            js: "knowledge_based/events",
          },
          css: {
            css: "add_events",
            available: 0,
          },
          menu: "add_events",
          data: {},
        };
        res.render("admin/knowledge_based/events/add_events.html", respData);
      } catch (err: unknown) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.post(
    "/admin_master/events/add",
    async function (req: Request, res: Response): Promise<void> {
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
              eventsController.ADD_EVENTS(data, function (respData) {
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
    "/admin_master/events/view",
    async function (req: Request, res: Response): Promise<void> {
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
              eventsController.VIEW_EVENTS(data, function (respData) {
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
    "/admin_master/events/delete",
    async function (req: Request, res: Response): Promise<void> {
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
              eventsController.DELETE_EVENTS(data, function (respData) {
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
    "/admin_master/events/list/:start/:limit",
    async function (req: Request, res: Response): Promise<void> {
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
              eventsController.LIST_EVENTS(data, function (respData) {
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

  app.get(
    "/admin_master/events/events_images",
    async function (req: Request, res: Response): Promise<void> {
      try {
        const respData: ResponseData = {
          base_url: BASE_URL ?? "",
          title: "Events Images List",
          config: config,
          script: {
            available: 1,
            js: "knowledge_based/events_images",
          },
          css: {
            available: 0,
            css: "events_images",
          },
          menu: "events_images",
          data: {},
        };
        res.render("admin/knowledge_based/events/events_images.html", respData);
      } catch (err: unknown) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.get(
    "/admin_master/events/event_images/addEdit",
    async function (req: Request, res: Response): Promise<void> {
      try {
        const respData: ResponseData = {
          base_url: BASE_URL ?? "",
          title: "Add Events Images",
          config: config,
          script: {
            available: 1,
            js: "knowledge_based/events_images",
          },
          css: {
            css: "add_events_images",
            available: 0,
          },
          menu: "add_events_images",
          data: {},
        };
        res.render(
          "admin/knowledge_based/events/add_events_images.html",
          respData
        );
      } catch (err: unknown) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.post(
    "/admin_master/events/events_images/add",
    async function (req: Request, res: Response): Promise<void> {
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
              eventsController.ADD_EVENTS_IMAGES(data, function (respData) {
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
    "/admin_master/events/events_images/view",
    async function (req: Request, res: Response): Promise<void> {
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
              eventsController.VIEW_EVENTS_IMAGES(data, function (respData) {
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
    "/admin_master/events/events_images/delete",
    async function (req: Request, res: Response): Promise<void> {
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
              eventsController.DELETE_EVENTS_IMAGES(data, function (respData) {
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
    "/admin_master/events/events_images/list/:start/:limit",
    async function (req: Request, res: Response): Promise<void> {
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
              eventsController.LIST_EVENTS_IMAGES(data, function (respData) {
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
>>>>>>> Stashed changes
}
