import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    const candidate = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (candidate) {
      return res.status(400).json({
        msg: "User already exists",
      })
    }

    const hash = bcrypt.hashSync(password, 10)

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hash,
      },
    })

    return res.json({
      status: true,
      user,
    })
  } catch (error) {
    next(error)
    console.log(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (!user) {
      return res.status(400).json({
        msg: "User does not exist",
      })
    }

    const hash = await bcrypt.compare(password, user.password)

    if (!hash) {
      return res.status(400).json({
        msg: "Password is not correct",
      })
    }

    delete user.password

    return res.json({
      status: true,
      user,
    })
  } catch (error) {
    next(error)
    console.log(error)
  }
}

const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id
    const avatarImage = req.body.image

    const updateUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        isAvatarImageSet: true,
        avatarImage: avatarImage,
      },
    })
    return res.json({
      isSet: updateUser.isAvatarImageSet,
      image: updateUser.avatarImage,
    })
  } catch (error) {
    next(error)
    console.log(error)
  }
}

const allusers = async (req, res, next) => {
  try {
    const { id } = req.body
    const getUsers = await prisma.user.findMany({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatarImage: true,
        password: false,
      },
    })
    return res.json(getUsers)
  } catch (error) {
    next(error)
  }
}

export default { register, login, setAvatar, allusers }
