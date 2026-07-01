package nlu.tmdt.dryfood_myapp.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.AdminReplyRequest;
import nlu.tmdt.dryfood_myapp.dto.request.ReportRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ReportDTO;
import nlu.tmdt.dryfood_myapp.dto.response.StoreSimpleDTO;
import nlu.tmdt.dryfood_myapp.entity.Report;
import nlu.tmdt.dryfood_myapp.entity.ReportResponse;
import nlu.tmdt.dryfood_myapp.entity.Store;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.repository.ReportRepository;
import nlu.tmdt.dryfood_myapp.repository.ReportResponseRepository;
import nlu.tmdt.dryfood_myapp.repository.StoreRepository;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import nlu.tmdt.dryfood_myapp.service.ReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final ReportResponseRepository reportResponseRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;

    @Override
    @Transactional
    public void createReport(String email, ReportRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

        Report report = Report.builder()
                .user(user)
                .store(store)
                .reason(request.getReason())
                .status("PENDING")
                .build();
        
        reportRepository.save(report);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportDTO> getMyReports(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        List<Report> reports = reportRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId());
        return reports.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportDTO> getAllReports() {
        List<Report> reports = reportRepository.findAllByOrderByCreatedAtDesc();
        return reports.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void replyToReport(String adminEmail, Integer reportId, AdminReplyRequest request) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        Optional<ReportResponse> existingResponse = reportResponseRepository.findByReportReportId(reportId);
        ReportResponse response;
        if (existingResponse.isPresent()) {
            response = existingResponse.get();
            response.setResponse(request.getResponse());
        } else {
            response = ReportResponse.builder()
                .report(report)
                .admin(admin)
                .response(request.getResponse())
                .build();
        }
        
        reportResponseRepository.save(response);

        report.setStatus("RESOLVED");
        reportRepository.save(report);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreSimpleDTO> getAllStores() {
        return storeRepository.findAll().stream()
            .map(store -> StoreSimpleDTO.builder()
                .storeId(store.getStoreId())
                .name(store.getName())
                .build())
            .collect(Collectors.toList());
    }

    private ReportDTO mapToDTO(Report report) {
        Optional<ReportResponse> responseOpt = reportResponseRepository.findByReportReportId(report.getReportId());
        
        return ReportDTO.builder()
                .reportId(report.getReportId())
                .storeId(report.getStore().getStoreId())
                .storeName(report.getStore().getName())
                .userName(report.getUser().getFullName())
                .userEmail(report.getUser().getEmail())
                .reason(report.getReason())
                .status(report.getStatus())
                .adminReply(responseOpt.map(ReportResponse::getResponse).orElse(null))
                .adminName(responseOpt.map(r -> r.getAdmin().getFullName()).orElse(null))
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }
}
