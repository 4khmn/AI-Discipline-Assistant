package akhm.project.habit.repository;

import akhm.project.habit.entity.UserDailyDiscipline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserDailyDisciplineRepository extends JpaRepository<UserDailyDiscipline, Long> {
    Optional<UserDailyDiscipline> findByUserIdAndDisciplineDate(Long userId, LocalDate disciplineDate);
    List<UserDailyDiscipline> findByUserIdOrderByDisciplineDateDesc(Long userId);
}
