package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.ReportRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.ReportDTO;
import nlu.tmdt.dryfood_myapp.dto.response.StoreSimpleDTO;
import nlu.tmdt.dryfood_myapp.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'STORE_OWNER')")
    public ResponseEntity<ApiResponse<Void>> createReport(
            Authentication authentication,
            @Valid @RequestBody ReportRequest request) {
        reportService.createReport(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Gửi báo cáo thành công", null));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'STORE_OWNER')")
    public ResponseEntity<ApiResponse<List<ReportDTO>>> getMyReports(Authentication authentication) {
        List<ReportDTO> reports = reportService.getMyReports(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Lấy lịch sử báo cáo thành công", reports));
    }

    @GetMapping("/stores")
    @PreAuthorize("hasAnyRole('USER', 'STORE_OWNER')")
    public ResponseEntity<ApiResponse<List<StoreSimpleDTO>>> getAllStores() {
        List<StoreSimpleDTO> stores = reportService.getAllStores();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách cửa hàng thành công", stores));
    }
}
