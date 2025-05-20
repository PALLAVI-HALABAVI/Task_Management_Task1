const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { route } = require("./authRoutes");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, exportTasksReport);
router.get("/export/users", protect, adminOnly, exportUsersReport);

module.exports = router;
