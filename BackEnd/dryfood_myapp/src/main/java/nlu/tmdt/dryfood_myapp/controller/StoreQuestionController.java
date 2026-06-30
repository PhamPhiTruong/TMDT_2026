package nlu.tmdt.dryfood_myapp.controller;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller Q&A cho sản phẩm.
 *
 * Phân quyền:
 *  GET  /api/questions/**       → Guest (public)        – đã cấu hình trong SecurityConfig
 *  POST /api/questions          → ROLE_USER             – khách mua hàng đặt câu hỏi
 *  POST /api/questions/{id}/answer → ROLE_STORE_OWNER   – chủ shop trả lời
 */
@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class StoreQuestionController {

    /**
     * GET /api/questions?productId=...
     * Guest được xem – không cần @PreAuthorize (đã permit trong SecurityConfig).
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getQuestions(
            @RequestParam(required = false) Long productId) {
        // TODO: inject QuestionService và gọi service
        return ResponseEntity.ok(ApiResponse.success("Danh sách câu hỏi", null));
    }

    /**
     * POST /api/questions
     * Chỉ ROLE_USER (khách mua hàng) mới được đặt câu hỏi.
     * STORE_OWNER không được dùng endpoint này để giả vờ hỏi.
     */
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Object>> askQuestion(
            @RequestBody Object request,
            Authentication authentication) {
        // authentication.getName() = email của người đặt câu hỏi
        // TODO: inject QuestionService và gọi service
        return ResponseEntity.ok(ApiResponse.success("Đặt câu hỏi thành công", null));
    }

    /**
     * POST /api/questions/{id}/answer
     * Chỉ ROLE_STORE_OWNER mới được trả lời câu hỏi.
     * Service layer cần kiểm tra thêm: câu hỏi thuộc sản phẩm của shop mình.
     */
    @PostMapping("/{id}/answer")
    @PreAuthorize("hasRole('STORE_OWNER')")
    public ResponseEntity<ApiResponse<Object>> answerQuestion(
            @PathVariable Long id,
            @RequestBody Object request,
            Authentication authentication) {
        // TODO: inject QuestionService, kiểm tra câu hỏi thuộc shop của authentication.getName()
        return ResponseEntity.ok(ApiResponse.success("Trả lời câu hỏi thành công", null));
    }
}
