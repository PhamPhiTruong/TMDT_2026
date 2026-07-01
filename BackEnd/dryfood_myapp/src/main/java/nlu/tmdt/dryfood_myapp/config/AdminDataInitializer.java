package nlu.tmdt.dryfood_myapp.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final nlu.tmdt.dryfood_myapp.repository.StoreRepository storeRepository;
    private final nlu.tmdt.dryfood_myapp.repository.ProductRepository productRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        String adminEmail = "admin001@admin.com";
        var adminOpt = userRepository.findByEmail(adminEmail);
        
        if (adminOpt.isEmpty()) {
            log.info("Creating default admin account...");
            User admin = User.builder()
                    .username("admin001")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("ad110603"))
                    .fullName("Administrator")
                    .role("ADMIN")
                    .status("ACTIVE")
                    .build();
            userRepository.save(admin);
            log.info("Default admin account created successfully.");
        } else {
            User admin = adminOpt.get();
            if (!"ACTIVE".equals(admin.getStatus())) {
                admin.setStatus("ACTIVE");
                userRepository.save(admin);
                log.info("Admin account status updated to ACTIVE.");
            } else {
                log.info("Admin account already exists and is ACTIVE.");
            }
        }

        // Tạo cửa hàng và mặt hàng mẫu để test tìm kiếm
        if (productRepository.count() < 15) {
            User storeOwner = userRepository.findByEmail(adminEmail).get();
            log.info("Creating mock stores and products...");
            
            // Cửa hàng 1
            nlu.tmdt.dryfood_myapp.entity.Store store1 = nlu.tmdt.dryfood_myapp.entity.Store.builder()
                    .owner(storeOwner)
                    .name("Nông Lâm Food - Cửa hàng chính hãng")
                    .description("Cửa hàng bán các loại trái cây sấy dẻo, sấy giòn, hạt dinh dưỡng chuẩn xuất khẩu.")
                    .url("nong-lam-food-chinh-hang")
                    .phone("0987654321")
                    .status("ACTIVE")
                    .build();
            store1 = storeRepository.save(store1);

            // Cửa hàng 2
            nlu.tmdt.dryfood_myapp.entity.Store store2 = nlu.tmdt.dryfood_myapp.entity.Store.builder()
                    .owner(storeOwner)
                    .name("Đặc Sản Vùng Miền")
                    .description("Chuyên cung cấp đặc sản mứt, trái cây sấy các vùng miền Việt Nam.")
                    .url("dac-san-vung-mien")
                    .phone("0912345678")
                    .status("ACTIVE")
                    .build();
            store2 = storeRepository.save(store2);

            java.util.List<nlu.tmdt.dryfood_myapp.entity.Product> mockProducts = java.util.Arrays.asList(
                    // 10 Sản phẩm cho Store 1
                    createMockProduct(store1, "Mít sấy giòn 500g", "Mít sấy giòn nguyên cánh, vị ngọt thanh tự nhiên", 150000, 100, "/icons/mitsay.jpg"),
                    createMockProduct(store1, "Xoài sấy dẻo 200g", "Xoài sấy dẻo không đường, chua ngọt đậm vị", 85000, 200, "/icons/xoaisay.jpg"),
                    createMockProduct(store1, "Hạt điều rang muối 400g", "Hạt điều rang muối Bình Phước, hạt to đều, giòn rụm", 220000, 50, "/icons/hatdieu.jpg"),
                    createMockProduct(store1, "Macca sấy nứt vỏ 300g", "Hạt Macca Úc sấy nứt vỏ, bổ dưỡng cho bà bầu", 180000, 75, "/icons/hatdieu.jpg"),
                    createMockProduct(store1, "Chuối sấy dẻo 500g", "Chuối sấy dẻo nguyên trái ngọt tự nhiên, không chất bảo quản", 65000, 150, "/icons/chuoisaymatong.jpg"),
                    createMockProduct(store1, "Khoai môn sấy giòn 250g", "Khoai môn thái lát sấy giòn tan, vị bùi béo", 75000, 120, "/icons/khoailang.jpg"),
                    createMockProduct(store1, "Nho khô Mỹ 300g", "Nho khô tự nhiên không tẩm đường, tốt cho sức khỏe", 120000, 90, "/icons/thanhlong.jpg"),
                    createMockProduct(store1, "Thanh long sấy dẻo 150g", "Thanh long đỏ sấy dẻo, ngọt thanh", 95000, 60, "/icons/thanhlong.jpg"),
                    createMockProduct(store1, "Vỏ bưởi sấy dẻo 200g", "Vỏ bưởi sấy dẻo chua ngọt, the mát, tốt cho tiêu hóa", 65000, 200, "/icons/khoailang.jpg"),
                    createMockProduct(store1, "Sầu riêng sấy thăng hoa 50g", "Sầu riêng sấy khô giòn, giữ nguyên hương vị", 155000, 40, "/icons/mitsay.jpg"),

                    // 10 Sản phẩm cho Store 2
                    createMockProduct(store2, "Mứt gừng Huế 300g", "Mứt gừng cay nồng, đặc sản mùa đông xứ Huế", 80000, 100, "/icons/xoaisay.jpg"),
                    createMockProduct(store2, "Mứt dừa Bến Tre 500g", "Mứt dừa non béo ngậy, ít ngọt", 120000, 80, "/icons/hatdieu.jpg"),
                    createMockProduct(store2, "Hạt sen sấy giòn 250g", "Hạt sen sấy giòn bùi béo, đặc sản Đồng Tháp", 130000, 60, "/icons/mitsay.jpg"),
                    createMockProduct(store2, "Khô gà lá chanh 500g", "Khô gà xé cay đậm vị lá chanh", 150000, 300, "/icons/khoailang.jpg"),
                    createMockProduct(store2, "Khô bò miếng 300g", "Khô bò miếng nguyên chất vị cay truyền thống", 280000, 50, "/icons/thanhlong.jpg"),
                    createMockProduct(store2, "Mứt mận Mộc Châu 400g", "Mứt mận dẻo chua chua ngọt ngọt", 95000, 150, "/icons/xoaisay.jpg"),
                    createMockProduct(store2, "Hạt dẻ cười Mỹ 250g", "Hạt dẻ cười hạt to, giòn bùi", 185000, 70, "/icons/hatdieu.jpg"),
                    createMockProduct(store2, "Đậu phộng tỏi ớt 500g", "Đậu phộng rang tỏi ớt giòn rụm", 55000, 200, "/icons/mitsay.jpg"),
                    createMockProduct(store2, "Bánh tráng me 10 bịch", "Bánh tráng cuốn me chua cay Tây Ninh", 60000, 120, "/icons/chuoisaymatong.jpg"),
                    createMockProduct(store2, "Kẹo dừa đậu phộng 400g", "Kẹo dừa truyền thống nhân đậu phộng", 70000, 110, "/icons/khoailang.jpg")
            );
            productRepository.saveAll(mockProducts);
            log.info("Mock stores and products created successfully.");
        }

        // Cập nhật lại ảnh bị hỏng (fix lỗi URL bizweb bị 404) hoặc bị sai
        // Cập nhật lại toàn bộ 20 sản phẩm để khớp hoàn hảo 100% với 6 hình ảnh có sẵn
        java.util.List<nlu.tmdt.dryfood_myapp.entity.Product> allProducts = productRepository.findAll();
        boolean needsUpdate = false;
        
        // Danh sách 20 sản phẩm chuẩn (phù hợp với 6 hình ảnh)
        String[] newNames = {
            "Mít sấy giòn 500g", "Mít sấy dẻo 200g", "Mít thái sấy mộc 300g", 
            "Xoài sấy dẻo 200g", "Xoài sấy giòn 150g", "Xoài sấy đường phèn 300g", "Xoài sấy chua ngọt 250g",
            "Hạt điều rang muối 400g", "Hạt điều rang bơ 300g", "Hạt điều vỏ lụa 500g",
            "Thanh long đỏ sấy dẻo 150g", "Thanh long sấy giòn 200g", "Thanh long sấy nguyên trái 300g",
            "Chuối sấy dẻo 500g", "Chuối sấy giòn 300g", "Chuối sấy mật ong mè 250g", "Chuối sấy nguyên trái 400g",
            "Khoai lang sấy mật 300g", "Khoai môn sấy giòn 250g", "Khoai lang tím sấy 200g"
        };
        
        String[] newImages = {
            "/icons/mitsay.jpg", "/icons/mitsay.jpg", "/icons/mitsay.jpg",
            "/icons/xoaisay.jpg", "/icons/xoaisay.jpg", "/icons/xoaisay.jpg", "/icons/xoaisay.jpg",
            "/icons/hatdieu.jpg", "/icons/hatdieu.jpg", "/icons/hatdieu.jpg",
            "/icons/thanhlong.jpg", "/icons/thanhlong.jpg", "/icons/thanhlong.jpg",
            "/icons/chuoisaymatong.jpg", "/icons/chuoisaymatong.jpg", "/icons/chuoisaymatong.jpg", "/icons/chuoisaymatong.jpg",
            "/icons/khoailang.jpg", "/icons/khoailang.jpg", "/icons/khoailang.jpg"
        };
        
        for (int i = 0; i < allProducts.size(); i++) {
            nlu.tmdt.dryfood_myapp.entity.Product p = allProducts.get(i);
            int idx = i % newNames.length;
            
            p.setName(newNames[idx]);
            p.setDescription("Sản phẩm " + newNames[idx] + " thơm ngon, đạt chuẩn xuất khẩu. Hoàn toàn tự nhiên không chất bảo quản.");
            
            for (nlu.tmdt.dryfood_myapp.entity.ProductImage img : p.getImages()) {
                img.setUrl(newImages[idx]);
            }
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            productRepository.saveAll(allProducts);
            log.info("Renamed all products to match the 6 local images perfectly.");
        }
    }

    private nlu.tmdt.dryfood_myapp.entity.Product createMockProduct(nlu.tmdt.dryfood_myapp.entity.Store store, String name, String desc, double price, int qty, String imgUrl) {
        nlu.tmdt.dryfood_myapp.entity.Product p = new nlu.tmdt.dryfood_myapp.entity.Product();
        p.setStore(store);
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(java.math.BigDecimal.valueOf(price));
        p.setQuantity(qty);
        p.setStatus(nlu.tmdt.dryfood_myapp.enums.ProductStatus.ACTIVE);
        
        nlu.tmdt.dryfood_myapp.entity.ProductImage img = nlu.tmdt.dryfood_myapp.entity.ProductImage.builder()
                .product(p)
                .url(imgUrl)
                .build();
        p.getImages().add(img);
        
        return p;
    }
}
