package com.tac.taskmanagement.repository;

import com.tac.taskmanagement.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    List<TaskEntity> findByName(String name);
    List<TaskEntity> findByDate(LocalDate date);

}
