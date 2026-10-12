const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const {
  Asset: AssetModel,
  EmailConfig: EmailConfigModel,
  EmailRecipient: EmailRecipientModel,
  AssetType: AssetTypeModel,
  AssetTypeNotification: AssetTypeNotificationModel,
} = require("../models");

// Hàm xử lý logic quét tài sản và gửi mail
async function scanAndSendExpiredAssets() {
  console.log("🔄 [Cron Job] Bắt đầu quét tài sản sắp hết hạn...");

  try {
    // 1. Tìm cấu hình Email đang hoạt động
    const mailConfig = await EmailConfigModel.findOne({
      where: { Active: true },
    });
    if (!mailConfig) {
      console.log(
        "⚠️ [Cron Job] Không tìm thấy cấu hình Email nào đang Active. Hủy tiến trình."
      );
      return;
    }

    const notifyDays = await AssetTypeNotificationModel.findAll({
      where: { Active: true },
    });
    console.log(
      "🔔 [Cron Job] Cấu hình ngày cảnh báo từ DB:",
      notifyDays[0].NotifyBeforeDays
    );

    // 2. Lấy danh sách Email người nhận
    const recipients = await EmailRecipientModel.findAll({
      attributes: ["Email"],
    });
    if (recipients.length === 0) {
      console.log(
        "⚠️ [Cron Job] Không có người nhận nào trong bảng EmailRecipient. Hủy tiến trình."
      );
      return;
    }
    const toEmails = recipients.map((r) => r.Email).join(", ");

    // 3. Tính toán khoảng thời gian (Ví dụ: Tìm tài sản hết hạn trong vòng 7 ngày tới)
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Đầu ngày hôm nay

    const endDate = new Date();
    endDate.setDate(startDate.getDate() + notifyDays[0].NotifyBeforeDays); // Cộng thêm số ngày cảnh báo từ
    endDate.setHours(23, 59, 59, 999);

    const warningAssets = await AssetModel.findAll({
      where: {
        ExpireDate: {
          //[Op.between]: [startDate, endDate],
          [Op.lte]: endDate, // Tìm tất cả tài sản có ExpireDate nhỏ hơn hoặc bằng endDate
        },
      },
      include: [{ model: AssetTypeModel, as: "assetTypeId" }], // Lấy kèm loại tài sản để hiển thị cho đẹp
    });

    if (warningAssets.length === 0) {
      console.log(
        "✅ [Cron Job] Không có tài sản nào sắp hết hạn trong hôm nay."
      );
      return;
    }

    // 4. Khởi tạo transporter của Nodemailer dựa trên cấu hình động từ DB
    const isSecure = mailConfig.Secure.toUpperCase() === "SSL"; // Nếu lưu chữ SSL thì secure = true (port 465)

    const transporter = nodemailer.createTransport({
      host: mailConfig.Host,
      port: parseInt(mailConfig.Port),
      secure: isSecure, // true cho port 465, false cho các port khác như 587 (TLS)
      auth: {
        user: mailConfig.Username,
        pass: mailConfig.Password, // Biến này chứa App Password 16 ký tự của Gmail
      },
      tls: {
        rejectUnauthorized: false, // Tránh lỗi từ chối chứng chỉ trên một số môi trường server
      },
    });

    // 5. Thiết lập nội dung Email (Báo cáo dạng HTML table)
    let assetRows = "";
    warningAssets.forEach((asset, index) => {
      assetRows += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>${asset.AssetName || asset.Name}</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${asset.AssetCode || ""}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${asset.assetTypeId?.Name || "Không rõ"}</td>
          <td style="border: 1px solid #ddd; padding: 8px; color: red; text-align: center;"><b>${asset.ExpireDate ? new Date(asset.ExpireDate).toLocaleDateString("vi-VN") : "Không xác định"}</b></td>
        </tr>
      `;
    });

    const mailOptions = {
      from: `"${mailConfig.FromName}" <${mailConfig.FromEmail}>`,
      to: toEmails,
      subject: `🚨 [CẢNH BÁO] Tài Sản Sắp Hết Hạn Hệ Thống - ${startDate.toLocaleDateString("vi-VN")}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto;">
          <h2 style="color: #d9534f;">Hệ thống thông báo tài sản sắp hết hạn bảo trì/sử dụng</h2>
          <p>Xin chào Ban Quản Lý,</p>
          <p>Hệ thống ghi nhận có <b>${warningAssets.length} tài sản</b> sẽ hết hạn vào ngày <b>${endDate.toLocaleDateString("vi-VN")}</b> (trong 7 ngày tới). Vui lòng kiểm tra và lên kế hoạch xử lý:</p>
          
          <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 8px; width: 5%;">STT</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Tên Tài Sản</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Mã Tài Sản</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Loại Tài Sản</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Ngày Hết Hạn</th>
              </tr>
            </thead>
            <tbody>
              ${assetRows}
            </tbody>
          </table>
          
          <br/>
          <p style="font-size: 12px; color: #777; font-style: italic;">Đây là email tự động từ hệ thống quản lý tài sản am01. Vui lòng không phản hồi lại email này.</p>
        </div>
      `,
    };

    // 6. Thực thi gửi mail
    const info = await transporter.sendMail(mailOptions);
    console.log(
      "🚀 [Cron Job] Đã gửi email cảnh báo thành công:",
      info.messageId
    );
  } catch (error) {
    console.error(
      "❌ [Cron Job] Gặp lỗi trong quá trình xử lý gửi mail tự động:",
      error
    );
  }
}

// Hàm kích hoạt lập lịch tự động chạy Job
function initCronJob() {
  // Cấu hình chạy định kỳ: Đang đặt mặc định là 08:00 sáng MỖI NGÀY ('0 8 * * *')
  // cron.schedule(
  //   //"0 8 * * *",
  //   "*/1 * * * *",
  //   () => {
  //     scanAndSendExpiredAssets();
  //   },
  //   {
  //     scheduled: true,
  //     timezone: "Asia/Ho_Chi_Minh", // Chạy chính xác theo múi giờ Việt Nam +7
  //   }
  // );
  scanAndSendExpiredAssets(); // Gọi ngay khi khởi động server để test, sau đó mới bật cron định kỳ
  console.log(
    "✅ [Cron Job] Lập lịch tự động quét gửi mail tài sản đã được kích hoạt (08:00 hàng ngày)."
  );
}

module.exports = { initCronJob, scanAndSendExpiredAssets };
