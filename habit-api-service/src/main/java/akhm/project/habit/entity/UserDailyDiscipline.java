package akhm.project.habit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_daily_disciplines", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "discipline_date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDailyDiscipline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "discipline_date", nullable = false)
    private LocalDate disciplineDate;

    @Builder.Default
    @Column(name = "water_2l", nullable = false)
    private boolean water2l = false;

    @Builder.Default
    @Column(name = "workout", nullable = false)
    private boolean workout = false;

    @Builder.Default
    @Column(name = "running", nullable = false)
    private boolean running = false;

    @Builder.Default
    @Column(name = "steps_10k", nullable = false)
    private boolean steps10k = false;

    @Builder.Default
    @Column(name = "outdoor_walk", nullable = false)
    private boolean outdoorWalk = false;

    @Builder.Default
    @Column(name = "leetcode", nullable = false)
    private boolean leetcode = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (disciplineDate == null) {
            disciplineDate = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
