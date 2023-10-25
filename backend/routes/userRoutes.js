const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");

router.get("/", protect, allUsers);
router.post("/", registerUser);
router.post("/login", authUser);

module.exports = router;
