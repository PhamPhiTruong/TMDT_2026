package nlu.tmdt.dryfood_myapp.dto.request.banner;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBannerRequest {
    @NotBlank
    private String imageUrl;

    private String title;

    private String linkUrl;

    @NotNull
    @PositiveOrZero
    private Integer position;
}
