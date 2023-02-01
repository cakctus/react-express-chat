import { Router } from "express"
import AuthController from "../controllers/usersControler.js"

const router = Router()

router.post("/register", AuthController.register)
router.post("/login", AuthController.login)
router.post("/setAvatar/:id", AuthController.setAvatar)
router.get("/allusers/:id", AuthController.allusers)

export default router
