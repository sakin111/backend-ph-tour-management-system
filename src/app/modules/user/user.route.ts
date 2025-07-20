
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import { checkAuth } from "../../middleware/checkAuth";
import { Router } from "express";







const router = Router()




router.post("/register",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createUserZodSchema) ,UserController.createUser)
router.get("/all-user", UserController.getAllUser)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updatedUser)

export const UserRoutes = router