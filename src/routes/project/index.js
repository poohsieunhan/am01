const express = require("express");
const projectController = require("../../controllers/project.controller.js");
const asyncHandler = require("../../helpers/asyncHandler.js");
const router = express.Router();

// router.use(apiKey);
// router.use(checkPermission('0000'));

router.get("", asyncHandler(projectController.getAllProjects));
router.get("/:Id", asyncHandler(projectController.getProjectById));
router.post("", asyncHandler(projectController.createProject));
router.put("/:Id", asyncHandler(projectController.updateProject));
router.delete("/:Id", asyncHandler(projectController.deleteProject));

module.exports = router;
