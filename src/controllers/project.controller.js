const projectService = require("../services/project.service");
const { SuccessResponse } = require("../core/success.response");

class ProjectController {
  createProject = async (req, res, next) => {
    try {
      //const inputData = req.body;
      // console.log('CreateProject - HEADERS:', req.headers);
      // console.log('CreateProject - RAW_BODY:', req.rawBody);
      // console.log('CreateProject - BODY:', inputData);
      new SuccessResponse({
        message: "Project created successfully",
        metadata: await projectService.createProject(req.body),
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  getAllProjects = async (req, res, next) => {
    const { page, limit, search } = req.query;
    new SuccessResponse({
      message: "Projects retrieved successfully",
      metadata: await projectService.getAllProjects({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: search || "",
      }),
    }).send(res);
  };

  getProjectById = async (req, res, next) => {
    const { Id } = req.params;
    //const idKey = Object.keys(req.params).find((k) => k.toLowerCase() === 'id');
    //const id = idKey ? req.params[idKey] : undefined;
    const project = await projectService.getProjectById(Id);
    new SuccessResponse({
      message: "Project retrieved successfully",
      metadata: project,
    }).send(res);
  };

  updateProject = async (req, res, next) => {
    const { Id } = req.params;
    const updatedProject = await projectService.updateProject(Id, req.body);
    new SuccessResponse({
      message: "Project updated successfully",
      metadata: updatedProject,
    }).send(res);
  };

  deleteProject = async (req, res, next) => {
    try {
      const { Id } = req.params;
      await projectService.deleteProject(Id);
      new SuccessResponse({
        message: "Project deleted successfully",
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };
}

module.exports = new ProjectController();
