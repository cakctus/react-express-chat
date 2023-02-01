import { Router } from "express"
import MessagesController from "../controllers/messagesController.js"

const router = Router()

router.post("/addmsg", MessagesController.addMessage)
router.post("/getmsg", MessagesController.getAllMessage)

export default router
