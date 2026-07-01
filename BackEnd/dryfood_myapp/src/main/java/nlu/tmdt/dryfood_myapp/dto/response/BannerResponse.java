package nlu.tmdt.dryfood_myapp.dto.response;

import lombok.*;
import nlu.tmdt.dryfood_myapp.enums.StoreStatus;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BannerResponse {
    private Integer id;

    private String imageUrl;

    private String title;

    private String linkUrl;

    private Integer position;

    private StoreStatus status;
}
