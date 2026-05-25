const XLSX = require("xlsx");
const { Op } = require("sequelize");
const CompanyModel = require("../models/company.model");

function normStr(v) {
  return String(v ?? "").trim();
}

function normMST(v) {
  // MST nên là text trong Excel để tránh dạng số khoa học
  return normStr(v).replace(/\s+/g, "");
}

function normEmail(v) {
  const s = normStr(v);
  return s ? s.toLowerCase() : "";
}

class ImportService {
  static async importCompany(buffer) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows.length) {
      return {
        total: 0,
        inserted: 0,
        errors: ["File Excel không có dữ liệu"],
      };
    }

    const total = rows.length;
    const errors = [];

    // 1) Validate + chống trùng trong file
    const seenMST = new Set();
    const candidates = []; // { rowNo, item }

    for (let i = 0; i < rows.length; i++) {
      const rowNo = i + 2; // header ở dòng 1
      const row = rows[i];

      const item = {
        TenCongTy: normStr(row["TenCongTy"]),
        MaSoThue: normMST(row["MaSoThue"]),
        DiaChi: normStr(row["DiaChi"]),
        Tel: normStr(row["Tel"]),
        Email: normEmail(row["Email"]),
        Fax: normStr(row["Fax"]),
        NguoiDaiDien: normStr(row["NguoiDaiDien"]),
        ChucVu: normStr(row["ChucVu"]),
      };

      if (!item.TenCongTy) {
        errors.push(`Dòng ${rowNo}: Thiếu TenCongTy`);
        continue;
      }

      if (!item.MaSoThue) {
        errors.push(`Dòng ${rowNo}: Thiếu MaSoThue`);
        continue;
      }

      if (seenMST.has(item.MaSoThue)) {
        errors.push(`Dòng ${rowNo}: MaSoThue bị trùng trong file (${item.MaSoThue})`);
        continue;
      }
      seenMST.add(item.MaSoThue);

      candidates.push({ rowNo, item });
    }

    if (!candidates.length) {
      return { total, inserted: 0, errors };
    }

    // 2) Check trùng DB theo batch
    const mstList = candidates.map((c) => c.item.MaSoThue);

    const existedRows = await CompanyModel.findAll({
      attributes: ["MaSoThue"],
      where: { MaSoThue: { [Op.in]: mstList } },
      raw: true,
    });

    const existedSet = new Set(existedRows.map((x) => normMST(x.MaSoThue)));

    // 3) Lọc ra data insert
    const insertData = [];
    for (const c of candidates) {
      if (existedSet.has(c.item.MaSoThue)) {
        errors.push(`Dòng ${c.rowNo}: Mã số thuế đã tồn tại (${c.item.MaSoThue})`);
        continue;
      }
      insertData.push(c.item);
    }

    // 4) Insert batch
    if (insertData.length) {
      await CompanyModel.bulkCreate(insertData, { validate: true });
    }

    return {
      total,
      inserted: insertData.length,
      errors,
    };
  }
}

module.exports = ImportService;
