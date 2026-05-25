const RequestFormModel = require("../models/requestform.model");
const RequestFormDetailModel = require("../models/requestformdetail.model");
const { fn, literal, Op } = require("sequelize");

class DashboardService {
  static async getRFSummary(data) {
    const where = {};
    if (data.fromDate && data.toDate) {
      where.createdAt = {
        [Op.between]: [data.fromDate, data.toDate],
      };
    }

    const foundRF = await RequestFormModel.findAndCountAll({
      where,
    });
    return foundRF;
  }

  static async getInspectionStats(data) {
    const rfWhere = {};
    if (data.fromDate && data.toDate) {
      rfWhere.createdAt = {
        [Op.between]: [data.fromDate, data.toDate],
      };
    }
    const result = await RequestFormDetailModel.findAll({
      attributes: [
        [fn("SUM", literal("CASE WHEN isHC = 1 THEN 1 ELSE 0 END")), "HC"],
        [fn("SUM", literal("CASE WHEN isKD = 1 THEN 1 ELSE 0 END")), "KD"],
        [fn("SUM", literal("CASE WHEN isDTN = 1 THEN 1 ELSE 0 END")), "DTN"],
        [fn("SUM", literal("CASE WHEN isKhac = 1 THEN 1 ELSE 0 END")), "Khac"],
      ],
      include: [
        {
          model: RequestFormModel,
          as: "RequestFormText",
          attributes: [],
          where: rfWhere,
          required: true,
        },
      ],
      raw: true,
    });
    return result;
  }
}

module.exports = DashboardService;
