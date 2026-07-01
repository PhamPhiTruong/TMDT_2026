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

        // ── 1. Tạo tài khoản Admin mặc định nếu chưa có ─────────────────────────
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

        // ── 2. Seed 25 sản phẩm trái cây sấy nếu bảng products đang trống ───────
        if (productRepository.count() == 0) {
            log.info("No products found — seeding 25 products from snapshot...");

            User storeOwner = userRepository.findByEmail(adminEmail).get();

            // -- Cửa hàng 1: Nông Lâm Food --
            nlu.tmdt.dryfood_myapp.entity.Store store1 = storeRepository
                    .findByUrl("nong-lam-food-chinh-hang")
                    .orElseGet(() -> storeRepository.save(
                            nlu.tmdt.dryfood_myapp.entity.Store.builder()
                                    .owner(storeOwner)
                                    .name("Nông Lâm Food - Cửa hàng chính hãng")
                                    .description("Cửa hàng bán các loại trái cây sấy dẻo, sấy giòn, hạt dinh dưỡng chuẩn xuất khẩu.")
                                    .url("nong-lam-food-chinh-hang")
                                    .phone("0987654321")
                                    .status("ACTIVE")
                                    .build()
                    ));

            // -- Cửa hàng 2: Đặc Sản Vùng Miền --
            nlu.tmdt.dryfood_myapp.entity.Store store2 = storeRepository
                    .findByUrl("dac-san-vung-mien")
                    .orElseGet(() -> storeRepository.save(
                            nlu.tmdt.dryfood_myapp.entity.Store.builder()
                                    .owner(storeOwner)
                                    .name("Đặc Sản Vùng Miền")
                                    .description("Chuyên cung cấp đặc sản mứt, trái cây sấy các vùng miền Việt Nam.")
                                    .url("dac-san-vung-mien")
                                    .phone("0912345678")
                                    .status("ACTIVE")
                                    .build()
                    ));

            // ── Danh sách 25 sản phẩm (snapshot từ DB thực tế) ──────────────────
            java.util.List<nlu.tmdt.dryfood_myapp.entity.Product> products = java.util.Arrays.asList(
                // Store 1 — 15 sản phẩm
                p(store1, "Mít sấy giòn 500g",           "Mít sấy giòn nguyên cánh, vị ngọt thanh tự nhiên, không chất bảo quản.",         150000, 100, "/icons/mitsay.jpg"),
                p(store1, "Mít sấy dẻo 200g",            "Mít sấy dẻo thái miếng, ngọt thanh, đạt chuẩn xuất khẩu.",                        85000, 200, "/icons/mitsay.jpg"),
                p(store1, "Mít thái sấy mộc 300g",       "Mít thái nguyên vị không tẩm ướp, giữ nguyên hương thơm tự nhiên.",               220000,  50, "/icons/mitsay.jpg"),
                p(store1, "Xoài sấy dẻo 200g",           "Xoài sấy dẻo không đường, chua ngọt đậm vị, tốt cho sức khỏe.",                  180000,  75, "/icons/xoaisay.jpg"),
                p(store1, "Xoài sấy giòn 150g",          "Xoài sấy giòn xốp, màu vàng đẹp, vị ngọt tự nhiên.",                              65000, 150, "/icons/xoaisay.jpg"),
                p(store1, "Xoài sấy đường phèn 300g",    "Xoài sấy với đường phèn nguyên chất, ngọt thanh dịu nhẹ.",                       150000, 100, "/icons/xoaisay.jpg"),
                p(store1, "Xoài sấy chua ngọt 250g",     "Xoài sấy chua ngọt hài hòa, vị đặc trưng miền Nam.",                              85000, 200, "/icons/xoaisay.jpg"),
                p(store1, "Hạt điều rang muối 400g",     "Hạt điều rang muối Bình Phước, hạt to đều, giòn rụm, béo bùi.",                  220000,  50, "/icons/hatdieu.jpg"),
                p(store1, "Hạt điều rang bơ 300g",       "Hạt điều rang bơ thơm lừng, béo ngậy, đặc sản Tây Nguyên.",                     180000,  75, "/icons/hatdieu.jpg"),
                p(store1, "Hạt điều vỏ lụa 500g",        "Hạt điều còn nguyên vỏ lụa, giàu dinh dưỡng, phù hợp bà bầu.",                   65000, 150, "/icons/hatdieu.jpg"),
                p(store1, "Thanh long đỏ sấy dẻo 150g",  "Thanh long đỏ sấy dẻo, ngọt thanh, giàu chất xơ và vitamin.",                    75000, 120, "/icons/thanhlong.jpg"),
                p(store1, "Thanh long sấy giòn 200g",    "Thanh long thái lát sấy giòn, vị nhẹ thanh, màu sắc đẹp.",                       120000,  90, "/icons/thanhlong.jpg"),
                p(store1, "Thanh long sấy nguyên trái 300g","Thanh long sấy nguyên trái dẻo, giữ nguyên hình dáng và hương vị.",            95000,  60, "/icons/thanhlong.jpg"),
                p(store1, "Chuối sấy dẻo 500g",          "Chuối sấy dẻo nguyên trái ngọt tự nhiên, không chất bảo quản.",                   65000, 200, "/icons/chuoisaymatong.jpg"),
                p(store1, "Chuối sấy giòn 300g",         "Chuối sấy giòn tan, vị ngọt nhẹ, ăn vặt lý tưởng cho mọi lứa tuổi.",           155000,  40, "/icons/chuoisaymatong.jpg"),

                // Store 2 — 10 sản phẩm
                p(store2, "Chuối sấy mật ong mè 250g",   "Chuối sấy tẩm mật ong mè, thơm ngọt đậm đà, đặc sản vùng miền.",                 80000, 100, "/icons/chuoisaymatong.jpg"),
                p(store2, "Chuối sấy nguyên trái 400g",  "Chuối sấy nguyên trái giữ nguyên hình dáng, ngọt tự nhiên.",                    120000,  80, "/icons/chuoisaymatong.jpg"),
                p(store2, "Khoai lang sấy mật 300g",     "Khoai lang sấy mật ong vàng ươm, bùi ngọt đặc trưng.",                          130000,  60, "/icons/khoailang.jpg"),
                p(store2, "Khoai môn sấy giòn 250g",     "Khoai môn thái lát sấy giòn tan, vị bùi béo thơm lừng.",                        150000, 300, "/icons/khoailang.jpg"),
                p(store2, "Khoai lang tím sấy 200g",     "Khoai lang tím Nhật sấy dẻo, màu tím đẹp, giàu anthocyanin.",                   280000,  50, "/icons/khoailang.jpg"),
                p(store2, "Mứt gừng Huế 300g",           "Mứt gừng cay nồng, đặc sản mùa đông xứ Huế, tốt cho tiêu hóa.",                 95000, 150, "/icons/xoaisay.jpg"),
                p(store2, "Mứt dừa Bến Tre 500g",        "Mứt dừa non béo ngậy, ít ngọt, đặc sản Bến Tre chuẩn truyền thống.",           185000,  70, "/icons/hatdieu.jpg"),
                p(store2, "Hạt sen sấy giòn 250g",       "Hạt sen sấy giòn bùi béo, đặc sản Đồng Tháp, tốt cho tim mạch.",               55000, 200, "/icons/mitsay.jpg"),
                p(store2, "Mứt mận Mộc Châu 400g",       "Mứt mận dẻo chua chua ngọt ngọt, đặc sản Mộc Châu Sơn La.",                     60000, 120, "/icons/xoaisay.jpg"),
                p(store2, "Hạt dẻ cười Mỹ 250g",         "Hạt dẻ cười nhập khẩu Mỹ, hạt to giòn bùi, bổ dưỡng cao.",                     70000, 110, "/icons/hatdieu.jpg")
            );

            productRepository.saveAll(products);
            log.info("Seeded 25 products successfully.");
        } else {
            log.info("Products already exist ({} items) — skipping seed.", productRepository.count());
        }
    }

    /** Helper tạo Product kèm 1 ảnh */
    private nlu.tmdt.dryfood_myapp.entity.Product p(
            nlu.tmdt.dryfood_myapp.entity.Store store,
            String name, String desc, double price, int qty, String imgUrl) {

        nlu.tmdt.dryfood_myapp.entity.Product product = new nlu.tmdt.dryfood_myapp.entity.Product();
        product.setStore(store);
        product.setName(name);
        product.setDescription(desc);
        product.setPrice(java.math.BigDecimal.valueOf(price));
        product.setQuantity(qty);
        product.setStatus(nlu.tmdt.dryfood_myapp.enums.ProductStatus.ACTIVE);

        nlu.tmdt.dryfood_myapp.entity.ProductImage img = nlu.tmdt.dryfood_myapp.entity.ProductImage.builder()
                .product(product)
                .url(imgUrl)
                .build();
        product.getImages().add(img);

        return product;
    }
}
