import express from "express";
import { getTestApi } from "../controllers/main-controller";

let router = express.Router();

router.get("/test", getTestApi);

export let getRouter = () => {
  return router;
}