package com.example.ARS.modular.teacher.dao;

import com.example.ARS.pojo.Assignment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends CrudRepository<Assignment,Long> {
    Optional<Assignment> findAssignmentById(Long id);

    @Query(""+
            "SELECT CASE WHEN COUNT(a) > 0 THEN " +
            "TRUE ELSE FALSE END " +
            "FROM Assignment a " +
            "WHERE a.name = ?1"
    )
    Boolean selectExistsByName(String name);

    List<Assignment> findAssignmentsByTeacherId(Long id);


}
