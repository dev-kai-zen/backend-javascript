import { Router } from "express";

import { testRoutes } from "../../../modules/test/test.routes.js";

export const v1ModulesRouter = Router();

v1ModulesRouter.use("/test", testRoutes);
