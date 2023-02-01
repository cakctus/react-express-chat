import { PrismaClient } from "@prisma/client"
import { nextTick } from "process"

const prisma = new PrismaClient()

const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body

    const user = await prisma.user.findUnique({
      where: {
        id: from,
      },
    })

    const data = await prisma.message.create({
      data: {
        message: message,
        users: [from, to],
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })

    if (data) return res.json({ msg: "Message added successfully." })
    else return res.json({ msg: "Failed to add message to the database" })
  } catch (error) {
    next(error)
  }
}

const getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body

    const messages = await prisma.message.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: false,
            username: false,
            password: false,
            isAvatarImageSet: false,
            avatarImage: false,
          },
        },
      },
      where: {
        users: {
          hasSome: [from, to],
        },
      },
    })

    const msg = messages.map((message) => {
      return {
        fromSelf: message.user.id === from,
        message: message.message,
      }
    })

    // console.log(messages)
    // console.log(from)
    return res.json(msg)
  } catch (error) {
    next(error)
  }
}

export default { addMessage, getAllMessage }
