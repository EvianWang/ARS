package com.example.ARS.modular.security.service;

import com.example.ARS.exception.BadRequestException;
import com.example.ARS.modular.security.dao.UserRepository;
import com.example.ARS.modular.teacher.dao.AssignmentRepository;
import com.example.ARS.modular.teacher.dao.EnrolmentRepository;
import com.example.ARS.modular.teacher.params.StudentInfoVo;
import com.example.ARS.pojo.ERole;
import com.example.ARS.pojo.EnrolmentId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AssignmentRepository assignmentRepository;

    @Autowired
    EnrolmentRepository enrolmentRepository;

    public List<StudentInfoVo> findAllStudentsInAssignment(Long assignmentId) {
        if (assignmentRepository.existsById(assignmentId)) {
            List<StudentInfoVo> result = new ArrayList<>();
            userRepository.findUsersByRole(ERole.ROLE_STUDENT)
                    .stream()
                    .forEach(student -> {
                        if (student.getEnrolments().contains(
                                enrolmentRepository.getById(new EnrolmentId(student.getId(),assignmentId)))) {
                            result.add(new StudentInfoVo(
                                    student.getId(),
                                    student.getName(),
                                    student.getEmail()
                            ));
                        }

                    });
            return result;
        } else {
            throw new BadRequestException("Assignment with Id " + assignmentId + " does not exists for adding students");
        }
    }

    public List<StudentInfoVo> findAllStudentsNotInAssignment(Long assignmentId) {
        if (assignmentRepository.existsById(assignmentId)) {
            List<StudentInfoVo> result = new ArrayList<>();
            userRepository.findUsersByRole(ERole.ROLE_STUDENT)
                    .stream()
                    .forEach(student -> {
                        if (!student.getEnrolments().contains(
                                enrolmentRepository.getById(new EnrolmentId(student.getId(),assignmentId)))) {
                            result.add(new StudentInfoVo(
                                    student.getId(),
                                    student.getName(),
                                    student.getEmail()
                            ));
                        }

                    });
            return result;
        } else {
            throw new BadRequestException("Assignment with Id " + assignmentId + " does not exists for adding students");
        }
    }

    public List<StudentInfoVo> searchStudentsNotInAssignment(String searchText,Long assignmentId) {
        if (assignmentRepository.existsById(assignmentId)) {
            List<StudentInfoVo> result = new ArrayList<>();
            userRepository.findUsersByRole(ERole.ROLE_STUDENT)
                    .stream()
                    .forEach(student -> {
                        if (student.getName().toLowerCase().contains(searchText.toLowerCase()) && !student.getEnrolments().contains(
                                enrolmentRepository.getById(new EnrolmentId(student.getId(),assignmentId)))) {
                            result.add(new StudentInfoVo(
                                    student.getId(),
                                    student.getName(),
                                    student.getEmail()
                            ));
                        }
                    });
            return result;
        } else {
            throw new BadRequestException("Assignment with Id " + assignmentId + " does not exists for adding students");
        }
    }

}
