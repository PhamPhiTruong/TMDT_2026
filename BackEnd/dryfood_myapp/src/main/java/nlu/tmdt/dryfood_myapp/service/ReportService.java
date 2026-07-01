package nlu.tmdt.dryfood_myapp.service;

import nlu.tmdt.dryfood_myapp.dto.request.AdminReplyRequest;
import nlu.tmdt.dryfood_myapp.dto.request.ReportRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ReportDTO;
import nlu.tmdt.dryfood_myapp.dto.response.StoreSimpleDTO;

import java.util.List;

public interface ReportService {
    void createReport(String email, ReportRequest request);
    List<ReportDTO> getMyReports(String email);
    List<ReportDTO> getAllReports();
    void replyToReport(String adminEmail, Integer reportId, AdminReplyRequest request);
    List<StoreSimpleDTO> getAllStores();
}
