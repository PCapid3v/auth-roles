const { PrismaClientKnownRequestError } = require("@prisma/client");
const { createUserDb } = require("../domains/user.js");
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { username, password,role = 2 } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Missing fields in request body",
    });
  }

  try {
    const createdUser = await createUserDb(username, password);

    return res.status(201).json({ user: createdUser });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res
          .status(409)
          .json({ error: "A user with the provided username already exists" });
      }
    }

    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  createUser,
};
