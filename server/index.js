import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/userRoutes.js"
import messagesRoutes from "./routes/messagesRoutes.js"
import { Server } from "socket.io"
import http from "http"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { PrismaClient } from "@prisma/client"

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/messages", messagesRoutes)

app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.js")
})

const prisma = new PrismaClient()
const httpServer = http.createServer(app)

const start = async () => {
  try {
    await prisma.$connect()
    httpServer.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
})

global.onlineUsers = new Map()

io.on("connection", (socket) => {
  console.log("connect")
  global.chatSocket = socket
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id)
  })

  socket.on("send-msg", (data) => {
    console.log("send", data)
    const sendUserSocket = onlineUsers.get(data.to)
    console.log(sendUserSocket, "sendUserSocket")
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message)
    }
  })
})

console.log(onlineUsers)
