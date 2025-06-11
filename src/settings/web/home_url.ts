import app from "../../app";
import { BASE_URL  } from "../../util/secrets";
import * as config from "../../../config.json";
import { ResponseData } from "../../types/common";
import { Request, Response } from 'express';

export function bindURL(): void {
  app.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
      const respData: ResponseData = {
        base_url: BASE_URL ?? "",
        title: "Home",
        config: config,
        script: {
          available: 0,
          js: "home",
        },
        css: {
          available: 0,
          css: "home",
        },
        menu: "home",
        data: {}
      };

      res.render("web/home/home.html", respData);
    } catch (err: unknown) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
}