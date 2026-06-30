package nlu.tmdt.dryfood_myapp.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.SimpleMailMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    // Constructor thuần bằng tay (Ép Java nhận diện JavaMailSender trước)
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * 1. Hàm xử lý gửi Email thông báo chốt đơn hàng (Chạy ngầm với @Async)
     */
    @Async
    public void sendOrderConfirmationEmail(String toEmail, Integer orderId, Double totalPrice, String status) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom("Nông Lâm Store <22130142@st.hcmuaf.edu.vn>");
            message.setTo(toEmail);
            message.setSubject("🎉 [Nông Lâm Store] Xác nhận đơn hàng #" + orderId);

            String content = "Chào bạn,\n\n"
                    + "Cảm ơn bạn đã đặt hàng tại Nông Lâm Store!\n"
                    + "Đơn hàng của bạn đã được hệ thống ghi nhận thành công.\n\n"
                    + "📍 Mã đơn hàng: #" + orderId + "\n"
                    + "💰 Tổng thanh toán: " + String.format("%,.0f", totalPrice) + " VNĐ\n"
                    + "⚙️ Trạng thái đơn hàng: " + status + "\n\n"
                    + "Cửa hàng sẽ chuẩn bị mặt hàng và giao đến bạn trong thời gian sớm nhất.\n"
                    + "Chúc bạn một ngày vui vẻ!";

            message.setText(content);
            mailSender.send(message);
            System.out.println("👉 Đã gửi email thông báo thành công tới: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi gửi email xác nhận đơn hàng: " + e.getMessage());
        }
    }

    /**
     * 2. CHỨC NĂNG THÊM MỚI: Gửi mã mã OTP xác thực (Chạy ngầm với @Async)
     * Gửi định dạng HTML để mã OTP hiển thị to, rõ ràng và đẹp mắt hơn.
     */
    @Async
    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            // Sử dụng MimeMessage để có thể viết code HTML/CSS cho Email
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("Nông Lâm Store <22130142@st.hcmuaf.edu.vn>");
            helper.setTo(toEmail);
            helper.setSubject("🔒 [Nông Lâm Store] Mã OTP Xác Thực Tài Khoản Của Bạn");

            // Thiết kế giao diện hộp thư OTP bằng HTML
            String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; rounded-all: 12px;\">"
                    + "  <div style=\"text-align: center; margin-bottom: 20px;\">"
                    + "    <h2 style=\"color: #1a5f3a; margin: 0;\">🌱 NÔNG LÂM STORE</h2>"
                    + "  </div>"
                    + "  <hr style=\"border: none; border-top: 1px solid #eee;\" />"
                    + "  <p style=\"font-size: 15px; color: #333;\">Chào bạn,</p>"
                    + "  <p style=\"font-size: 15px; color: #333;\">Bạn đang thực hiện thao tác xác thực tại hệ thống của Nông Lâm Store. Đây là mã bí mật OTP của bạn (có hiệu lực trong vòng 5 phút):</p>"
                    + "  <div style=\"text-align: center; margin: 30px 0;\">"
                    + "    <span style=\"font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1a5f3a; background-color: #f0f7f4; padding: 12px 30px; border-radius: 8px; border: 1px dashed #1a5f3a;\">"
                    +       otpCode
                    + "    </span>"
                    + "  </div>"
                    + "  <p style=\"font-size: 13px; color: #ef4444; font-style: italic;\">Lưu ý: Tuyệt đối KHÔNG chia sẻ mã này với bất kỳ ai để đảm bảo an toàn bảo mật tài khoản.</p>"
                    + "  <hr style=\"border: none; border-top: 1px solid #eee; margin-top: 30px;\" />"
                    + "  <p style=\"font-size: 12px; color: #999; text-align: center;\">Đây là email tự động từ hệ thống, vui lòng không phản hồi lại email này.</p>"
                    + "</div>";

            helper.setText(htmlContent, true); // Tham số true thứ hai nghĩa là gửi định dạng HTML
            mailSender.send(mimeMessage);
            System.out.println("👉 Đã gửi thành công mã OTP [" + otpCode + "] tới: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi gửi email OTP: " + e.getMessage());
        }
    }
}