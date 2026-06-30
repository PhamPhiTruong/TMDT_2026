package nlu.tmdt.dryfood_myapp.service;


import nlu.tmdt.dryfood_myapp.dto.request.VoucherRequest;
import nlu.tmdt.dryfood_myapp.entity.Voucher;
import nlu.tmdt.dryfood_myapp.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    public Double validateAndCalculateDiscount(VoucherRequest request) {
        // 1. Tìm voucher trong DB
        Voucher voucher = voucherRepository.findById(request.getCode())
                .orElseThrow(() -> new RuntimeException("Mã giảm giá này không tồn tại trên hệ thống!"));

        // 2. Check trạng thái hoạt động
        if (voucher.getIsActive() == null || !voucher.getIsActive()) {
            throw new RuntimeException("Mã giảm giá này hiện đang bị khóa!");
        }

        // 3. Check thời gian hiệu lực (Thời gian hiện tại là năm 2026)
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
            throw new RuntimeException("Mã giảm giá đã hết hạn hoặc chưa đến thời gian sử dụng!");
        }

        // 4. Check số lượt dùng còn lại
        if (voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new RuntimeException("Mã giảm giá này đã được sử dụng hết lượt!");
        }

        // 5. Check điều kiện đơn hàng tối thiểu
        if (request.getOrderAmount() < voucher.getMinOrderValue()) {
            throw new RuntimeException("Đơn hàng của bạn chưa đủ điều kiện tối thiểu " +
                    String.format("%,.0f", voucher.getMinOrderValue()) + "đ để áp dụng mã này!");
        }

        // 6. Tính số tiền giảm
        Double discountAmount = 0.0;
        if ("FIXED".equalsIgnoreCase(voucher.getDiscountType())) {
            discountAmount = voucher.getDiscountValue();
        } else if ("PERCENTAGE".equalsIgnoreCase(voucher.getDiscountType())) {
            discountAmount = request.getOrderAmount() * (voucher.getDiscountValue() / 100.0);

            // Giới hạn số tiền giảm tối đa (Nếu có cài đặt)
            if (voucher.getMaxDiscountValue() != null && discountAmount > voucher.getMaxDiscountValue()) {
                discountAmount = voucher.getMaxDiscountValue();
            }
        }

        // Không cho phép số tiền giảm vượt quá tổng tiền đơn hàng
        return Math.min(discountAmount, request.getOrderAmount());
    }
}