import { Router } from "express";
import { StoppageController } from "../controllers/stoppage.controller";
import {
  createStoppageSchema,
  updateStoppageSchema,
} from "../validations/stoppage.validation";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.get("/", StoppageController.getAll);
router.get("/:id", StoppageController.getById);

router.post(
  "/",
  validateRequest(createStoppageSchema),
  StoppageController.create
);

router.put(
  "/:id",
  validateRequest(updateStoppageSchema),
  StoppageController.update
);

router.delete("/:id", StoppageController.delete);

export default router;
