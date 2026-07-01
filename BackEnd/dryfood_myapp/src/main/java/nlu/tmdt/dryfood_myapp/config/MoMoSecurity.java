package nlu.tmdt.dryfood_myapp.config;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class MoMoSecurity {

    public static String signHmacSHA256(String data, String secretKey) throws Exception {
        // Log chuỗi data ra console để bạn dễ dàng copy đi so sánh với chuỗi lỗi của MoMo
        System.out.println("=== [MoMo Debug] Chuoi data mang di ky signature: " + data);

        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);

        byte[] rawHmac = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));

        // Chuyển mảng byte sang chuỗi Hex viết thường
        StringBuilder hexString = new StringBuilder();
        for (byte b : rawHmac) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}