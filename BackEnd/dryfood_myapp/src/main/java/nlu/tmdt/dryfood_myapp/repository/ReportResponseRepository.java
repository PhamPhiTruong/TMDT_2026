package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.ReportResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportResponseRepository extends JpaRepository<ReportResponse, Integer> {
    Optional<ReportResponse> findByReportReportId(Integer reportId);
}
