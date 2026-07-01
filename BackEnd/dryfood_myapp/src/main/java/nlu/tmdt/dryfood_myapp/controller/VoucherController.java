package nlu.tmdt.dryfood_myapp.controller;

import nlu.tmdt.dryfood_myapp.dto.request.VoucherRequest;
import nlu.tmdt.dryfood_myapp.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vouchers")
@CrossOrigin(origins = "*") // Đập tan nỗi lo lỗi CORS từ FE sang BE
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    @PostMapping("/validate")
    public ResponseEntity<?> validateVoucher(@RequestBody VoucherRequest request) {
        try {
            Double discountAmount = voucherService.validateAndCalculateDiscount(request);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("code", request.getCode());
            response.put("discountAmount", discountAmount);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Trả về lỗi kèm thông báo text cụ thể để FE hiện alert gõ sai cái gì
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}