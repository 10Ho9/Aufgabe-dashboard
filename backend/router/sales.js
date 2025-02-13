import express from "express";

import * as salesController from "../controller/sales.js";

const router = express.Router();

router.get("/:yearMonth", salesController.getSales);
router.post("/", salesController.createSales);

export default router;
