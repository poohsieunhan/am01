const { Project: ProjectModel } = require("../models");
const { Asset: AssetModel } = require("../models");
const { ErrorResponse, BadRequestError } = require("../core/error.response");
const { Op } = require("sequelize");

class ProjectService {
  // Tạo mới 1 Project
  static async createProject(data) {
    const _name = data.Name;
    const existingProject = await ProjectModel.findOne({
      where: { Name: _name },
    });
    if (existingProject) {
      throw new ErrorResponse("Project with this Name already exists.");
    }

    const project = await ProjectModel.create(data);
    return project;
  }

  // Lấy danh sách Project
  static async getAllProjects({ page = 1, limit = 10, search = "" } = {}) {
    const offset = (page - 1) * limit;

    const where = {};
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { Name: { [Op.like]: q } },
        { Address: { [Op.like]: q } },
        { Description: { [Op.like]: q } },
      ];
    }

    const { rows, count } = await ProjectModel.findAndCountAll({
      where,
      offset,
      limit,
      order: [["Id", "DESC"]],
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // Lấy detail 1 Project theo Id
  static async getProjectById(id) {
    const project = await ProjectModel.findByPk(id);
    return project; // có thể null nếu không tìm thấy
  }

  // Cập nhật 1 Project
  static async updateProject(id, data) {
    //console.log('UpdateProject - data:', data);
    const project = await ProjectModel.findByPk(id);
    if (!project) {
      return null;
    }

    await project.update(data);
    return project;
  }

  // Xóa 1 Project
  static async deleteProject(id) {
    const project = await ProjectModel.findByPk(id);

    const foundProject = await AssetModel.count({
      where: { ProjectId: id },
    });
    if (foundProject > 0)
      throw new ErrorResponse(
        "Dự án đã tồn tại trong Phiếu yêu cầu. Không thể xóa!"
      );

    if (!project) {
      return null;
    }

    await project.destroy();
    return true;
  }
}

module.exports = ProjectService;
