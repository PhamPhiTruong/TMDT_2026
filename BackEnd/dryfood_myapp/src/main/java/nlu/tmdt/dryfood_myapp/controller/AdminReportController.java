package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.AdminReplyRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.ReportDTO;
import nlu.tmdt.dryfood_myapp.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportDTO>>> getAllReports() {
        List<ReportDTO> reports = reportService.getAllReports();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách báo cáo thành công", reports));
    }

    @PostMapping("/{reportId}/reply")
    public ResponseEntity<ApiResponse<Void>> replyToReport(
            Authentication authentication,
            @PathVariable Integer reportId,
            @Valid @RequestBody AdminReplyRequest request) {
        reportService.replyToReport(authentication.getName(), reportId, request);
        return ResponseEntity.ok(ApiResponse.success("Phản hồi báo cáo thành công", null));
    }
}
