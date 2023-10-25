const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, allMessage } = require("../controllers/messageController");

const router = express.Router();

router.get("/:chatId", protect, allMessage);
router.post("/", protect, sendMessage);

module.exports = router;
