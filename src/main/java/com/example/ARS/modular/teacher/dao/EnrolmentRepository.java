package com.example.ARS.modular.teacher.dao;

import com.example.ARS.pojo.Enrolment;
import com.example.ARS.pojo.EnrolmentId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnrolmentRepository extends JpaRepository<Enrolment, EnrolmentId> {

    Enrolment getById(EnrolmentId enrolmentId);

}
