-- Migration: Thêm các cột mới vào bảng addresses
-- Chạy script này một lần trên DB hiện tại để bổ sung cấu trúc cho tính năng quản lý địa chỉ

ALTER TABLE addresses
    ADD COLUMN IF NOT EXISTS province_id   INT          NULL COMMENT 'Mã tỉnh/thành (dùng cho API giao vận)',
    ADD COLUMN IF NOT EXISTS district_id   INT          NULL COMMENT 'Mã quận/huyện (dùng cho API giao vận)',
    ADD COLUMN IF NOT EXISTS ward_id       VARCHAR(20)  NULL COMMENT 'Mã phường/xã (dùng cho API giao vận)',
    ADD COLUMN IF NOT EXISTS province_name VARCHAR(100) NULL COMMENT 'Tên tỉnh/thành lưu sẵn để hiển thị',
    ADD COLUMN IF NOT EXISTS district_name VARCHAR(100) NULL COMMENT 'Tên quận/huyện lưu sẵn để hiển thị',
    ADD COLUMN IF NOT EXISTS ward_name     VARCHAR(100) NULL COMMENT 'Tên phường/xã lưu sẵn để hiển thị',
    ADD COLUMN IF NOT EXISTS detail_address VARCHAR(255) NULL COMMENT 'Số nhà, tên đường';

-- Đảm bảo cột address (legacy) vẫn giữ nguyên để tương thích với dữ liệu cũ.
-- Các bản ghi cũ sẽ có address được điền sẵn, detail_address/ward_name/... = NULL.

-- Ghi chú: Với Hibernate ddl-auto=update, các cột này cũng sẽ được tạo tự động.
-- Script này dùng cho môi trường production với ddl-auto=none hoặc validate.
