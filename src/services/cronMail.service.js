const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const {
  Asset: AssetModel,
  EmailConfig: EmailConfigModel,
  EmailRecipient: EmailRecipientModel,
  AssetType: AssetTypeModel,
  AssetTypeNotification: AssetTypeNotificationModel,
  Company: CompanyModel,
  Project: ProjectModel,
  Account: AccountModel,
} = require("../models");

// Hàm xử lý logic quét tài sản và gửi mail (dùng cho cả Cron job và nút bấm thủ công trên Dashboard)
async function scanAndSendExpiredAssets(options = {}) {
  // Mặc định quét "all_warning" (bao gồm cả tài sản đã hết hạn và sắp hết hạn)
  const type = options.type || "all_warning"; // "all_warning" | "expiring" | "expired"
  const customDays = options.days ? Number(options.days) : null;
  console.log(`🔄 [Mail Service] Bắt đầu quét tài sản (type: ${type}, days: ${customDays || "mặc định"})...`);

  // 1. Tìm cấu hình Email đang hoạt động
  const mailConfig = await EmailConfigModel.findOne({
    where: { Active: true },
  });
  if (!mailConfig) {
    const msg = "Không tìm thấy cấu hình Email nào đang kích hoạt (Active = true) trong hệ thống.";
    console.log(`⚠️ [Mail Service] ${msg}`);
    throw new Error(msg);
  }

  // 2. Lấy danh sách Email người nhận
  const recipients = await EmailRecipientModel.findAll({
    where: { Active: true },
    attributes: ["Email"],
  });
  if (!recipients || recipients.length === 0) {
    const msg = "Không có người nhận nào trong bảng EmailRecipient. Vui lòng cấu hình người nhận email trước.";
    console.log(`⚠️ [Mail Service] ${msg}`);
    throw new Error(msg);
  }
  const toEmails = recipients
    .map((r) => r.Email)
    .filter(Boolean)
    .join(", ");
  if (!toEmails) {
    throw new Error("Không có địa chỉ email hợp lệ trong bảng EmailRecipient.");
  }

  // 3. Tính toán khoảng thời gian
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  const notifyBeforeDays = customDays || 30;
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + Number(notifyBeforeDays));
  endDate.setHours(23, 59, 59, 999);

  let whereCondition = {};
  let titleType = "";
  let periodText = "";

  // Điều kiện trạng thái: Chỉ quét tài sản có tình trạng ĐANG SỬ DỤNG (Status = 1, loại trừ 0: Ngưng sử dụng)
  const activeStatusCondition = {
    [Op.or]: [
      { Status: 1 },
      { Status: "1" },
    ],
  };

  if (type === "expired") {
    // 1. Chỉ tài sản ĐÃ HẾT HẠN (quá hạn trước ngày hôm nay)
    titleType = "ĐÃ HẾT HẠN";
    periodText = `tính đến ngày ${startDate.toLocaleDateString("vi-VN")}`;
    whereCondition = {
      ...activeStatusCondition,
      ExpireDate: {
        [Op.ne]: null,
        [Op.lt]: startDate,
      },
    };
  } else if (type === "expiring") {
    // 2. Chỉ tài sản SẮP HẾT HẠN trong N ngày tới
    titleType = "SẮP HẾT HẠN";
    periodText = `trong vòng ${notifyBeforeDays} ngày tới (từ ${startDate.toLocaleDateString("vi-VN")} đến ${endDate.toLocaleDateString("vi-VN")})`;
    whereCondition = {
      ...activeStatusCondition,
      ExpireDate: {
        [Op.between]: [startDate, endDate],
      },
    };
  } else {
    // 3. type === "all_warning" (chạy định kỳ tự động hoặc quét toàn bộ cảnh báo):
    // Quét CẢ tài sản ĐÃ HẾT HẠN (< startDate) VÀ tài sản SẮP HẾT HẠN (từ startDate đến endDate)
    titleType = "QUÁ HẠN & SẮP HẾT HẠN";
    periodText = `đã quá hạn và sắp hết hạn trong vòng ${notifyBeforeDays} ngày tới`;
    whereCondition = {
      ...activeStatusCondition,
      ExpireDate: {
        [Op.ne]: null,
        [Op.lte]: endDate, // Bao gồm cả đã quá hạn (< startDate) và sắp hết hạn (<= endDate)
      },
    };
  }

  const warningAssets = await AssetModel.findAll({
    where: whereCondition,
    include: [
      { model: AssetTypeModel, as: "assetTypeId" },
      { model: CompanyModel, as: "company" },
      { model: ProjectModel, as: "project" },
      { model: AccountModel, as: "account" },
    ],
    order: [["ExpireDate", "ASC"]],
  });

  if (!warningAssets || warningAssets.length === 0) {
    console.log(`✅ [Mail Service] Không có tài sản nào ${titleType.toLowerCase()} để gửi mail.`);
    return {
      success: true,
      count: 0,
      message: `Không có tài sản nào ${titleType.toLowerCase()} trong khoảng thời gian đã chọn.`,
    };
  }

  // 4. Khởi tạo transporter của Nodemailer dựa trên cấu hình động từ DB
  let port = parseInt(mailConfig.Port, 10) || 25;
  const isEurowindowMail = String(mailConfig.Host || "").toLowerCase().includes("eurowindow");
  // Nếu là mail nội bộ Eurowindow và đang để port 587, tự động chuyển về port 25 chuẩn relay
  if (isEurowindowMail && port === 587) {
    port = 25;
  }
  const isSecure = port === 465;

  // Cổng 25 hoặc mail nội bộ Eurowindow (Exchange chỉ hỗ trợ NTLM) chạy Anonymous Relay không gửi AUTH PLAIN
  const isAnonymousRelay = isEurowindowMail || port === 25 || String(mailConfig.Secure || "").toUpperCase().trim() === "NONE";

  const hasAuth =
    !isAnonymousRelay &&
    mailConfig.Username &&
    mailConfig.Username.trim() &&
    mailConfig.Username.trim().toLowerCase() !== "none" &&
    mailConfig.Password &&
    mailConfig.Password.trim() &&
    mailConfig.Password.trim().toLowerCase() !== "none";

  console.log(`\n========================================`);
  console.log(`📧 [THÔNG TIN CẤU HÌNH ĐANG DÙNG]`);
  console.log(`- Host: ${mailConfig.Host}`);
  console.log(`- Port: ${port} (DB lưu: ${mailConfig.Port})`);
  console.log(`- Secure: "${mailConfig.Secure}"`);
  console.log(`- Chế độ: ${isAnonymousRelay ? "ANONYMOUS RELAY (Không gửi mật khẩu)" : "XÁC THỰC AUTH (Có gửi mật khẩu)"}`);
  console.log(`========================================\n`);

  const transporterOptions = {
    host: mailConfig.Host ? mailConfig.Host.trim() : "mail.eurowindow.biz",
    port: port,
    secure: isSecure, // true chỉ cho port 465
    tls: {
      rejectUnauthorized: false, // Bỏ qua kiểm tra chứng chỉ SSL
    },
    logger: true, // In log chi tiết SMTP
    debug: true,  // In toàn bộ gói tin gửi nhận ra terminal
  };

  if (hasAuth) {
    transporterOptions.auth = {
      user: mailConfig.Username.trim(),
      pass: mailConfig.Password.trim(),
    };
  } else {
    console.log("ℹ️ [Mail Service] Chế độ Anonymous Relay (Không gửi tài khoản/mật khẩu).");
  }

  const transporter = nodemailer.createTransport(transporterOptions);

  // 5. Thiết lập nội dung Email (Báo cáo dạng HTML table)
  let assetRows = "";
  warningAssets.forEach((asset, index) => {
    const expireDate = asset.ExpireDate ? new Date(asset.ExpireDate) : null;
    let diffDaysText = "";
    let statusColor = "#e11d48";

    if (expireDate) {
      const target = new Date(expireDate.getFullYear(), expireDate.getMonth(), expireDate.getDate());
      const diffTime = target - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        diffDaysText = `Đã quá hạn ${Math.abs(diffDays)} ngày`;
        statusColor = "#e11d48"; // Đỏ
      } else if (diffDays === 0) {
        diffDaysText = "Hết hạn hôm nay";
        statusColor = "#dc2626"; // Đỏ đậm
      } else {
        diffDaysText = `Còn ${diffDays} ngày`;
        statusColor = "#d97706"; // Vàng hổ phách
      }
    } else {
      diffDaysText = "Không xác định";
      statusColor = "#64748b";
    }

    const expireStr = expireDate
      ? expireDate.toLocaleDateString("vi-VN")
      : "Không xác định";
    const compProj = [asset.company?.TenCongTy, asset.project?.Name]
      .filter(Boolean)
      .join(" / ") || "-";
    const accountName = asset.account?.Name || "-";

    assetRows += `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; color: #64748b;">${index + 1}</td>
        <td style="border: 1px solid #ddd; padding: 8px;"><b>${asset.Name || "-"}</b></td>
        <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${asset.Code || "-"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${asset.assetTypeId?.Name || "Không rõ"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${compProj}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${accountName}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">${expireStr}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: ${statusColor};">${diffDaysText}</td>
      </tr>
    `;
  });

  const expiredCount = warningAssets.filter(
    (a) => a.ExpireDate && new Date(a.ExpireDate) < startDate
  ).length;
  const expiringCount = warningAssets.filter(
    (a) => a.ExpireDate && new Date(a.ExpireDate) >= startDate
  ).length;

  let summaryNotice = "";
  let subjectText = "";
  if (type === "all_warning") {
    subjectText = `🚨 [CẢNH BÁO HOSTING/DOMAIN] ${expiredCount} Quá Hạn & ${expiringCount} Sắp Hết Hạn - ${startDate.toLocaleDateString("vi-VN")}`;
    summaryNotice = `Hệ thống ghi nhận có <b>${warningAssets.length} tài sản</b> (trạng thái <b>Đang sử dụng</b>) cần xử lý, bao gồm: <span style="color: #dc2626; font-weight: bold;">${expiredCount} Hosting/Domain đã quá hạn</span> và <span style="color: #d97706; font-weight: bold;">${expiringCount} Hosting/Domain sắp hết hạn trong ${notifyBeforeDays} ngày tới</span>.`;
  } else {
    subjectText = `🚨 [CẢNH BÁO HOSTING/DOMAIN] Danh Sách ${titleType} - ${startDate.toLocaleDateString("vi-VN")}`;
    summaryNotice = `Hệ thống ghi nhận có <b>${warningAssets.length} Hosting/Domain</b> (trạng thái <b>Đang sử dụng</b>) đang trong tình trạng <b>${titleType.toLowerCase()}</b> (${periodText}).`;
  }

  const mailOptions = {
    from: `"${mailConfig.FromName}" <${mailConfig.FromEmail}>`,
    to: toEmails,
    subject: subjectText,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 900px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #d9534f; margin-top: 0;">🚨 Thông báo danh sách Hosting/Domain ${titleType.toLowerCase()}</h2>
        <p>Xin chào,</p>
        <p>${summaryNotice} Vui lòng kiểm tra và lên kế hoạch xử lý:</p>
        
        <table style="border-collapse: collapse; width: 100%; margin-top: 15px; font-size: 13px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px; width: 5%; text-align: center;">STT</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tên Tài Sản</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Mã Tài Sản</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Loại Tài Sản</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Công ty / Dự án</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Tài khoản</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Ngày Hết Hạn</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Tình Trạng Hạn</th>
            </tr>
          </thead>
          <tbody>
            ${assetRows}
          </tbody>
        </table>
        
        <br/>
        <p style="font-size: 12px; color: #777; font-style: italic;">Đây là email tự động từ Khối CNTT. Vui lòng không phản hồi lại email này.</p>
      </div>
    `,
  };

  // 6. Thực thi gửi mail
  const info = await transporter.sendMail(mailOptions);
  console.log("🚀 [Mail Service] Đã gửi email cảnh báo thành công:", info.messageId);

  return {
    success: true,
    count: warningAssets.length,
    messageId: info.messageId,
    recipients: toEmails,
    message: `Đã gửi email cảnh báo (${warningAssets.length} tài sản ${titleType.toLowerCase()}) thành công đến: ${toEmails}`,
  };
}

// Khởi tạo lập lịch Cron Job chạy tự động vào lúc 15:00 (3h chiều) mỗi ngày
function initCronJob() {
  // Lịch chạy: '0 15 * * *' = đúng 15:00 (3h chiều) hàng ngày theo giờ Việt Nam
  cron.schedule(
    "30 09 * * *",
    async () => {
      console.log(
        "⏰ [Cron Job 15:00] Bắt đầu tự động quét tài sản quá hạn và sắp hết hạn trong 30 ngày..."
      );
      try {
        await scanAndSendExpiredAssets({
          type: "all_warning",
          days: 30,
        });
      } catch (err) {
        console.error("❌ [Cron Job 15:00 Error]:", err?.message || err);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh",
    }
  );

  console.log(
    "✅ [Cron Job] Đã kích hoạt lập lịch tự động gửi mail cảnh báo tài sản vào lúc 15:00 (3h chiều) hàng ngày."
  );
}

module.exports = { initCronJob, scanAndSendExpiredAssets };
