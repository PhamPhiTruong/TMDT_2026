package nlu.tmdt.dryfood_myapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "store_response_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreResponseQuestion extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_question_id", nullable = false)
    private StoreQuestion storeQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "response", columnDefinition = "TEXT")
    private String response;
}
