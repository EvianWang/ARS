package com.example.ARS.modular.student.service;

import com.example.ARS.exception.BadRequestException;
import com.example.ARS.modular.security.UserDetailsImpl;
import com.example.ARS.modular.security.dao.UserRepository;
import com.example.ARS.modular.teacher.dao.AssignmentRepository;
import com.example.ARS.modular.teacher.dao.EnrolmentRepository;
import com.example.ARS.modular.teacher.params.StudentAssignmentInfoVo;
import com.example.ARS.pojo.Assignment;
import com.example.ARS.pojo.Enrolment;
import com.example.ARS.pojo.EnrolmentId;
import com.example.ARS.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudentService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    AssignmentRepository assignmentRepository;

    @Autowired
    EnrolmentRepository enrolmentRepository;

    public Long getIdFromToken() {
        Long result = null;
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetailsImpl) {
                String email = ((UserDetailsImpl) principal).getUsername();
                if (userRepository.findUserByEmail(email).isPresent()) {
                    User u = userRepository.findUserByEmail(email).get();
                    result = u.getId();
                } else {
                    throw new BadRequestException("User in token is not found");
                }
            } else {
                throw new BadRequestException("Illegal authentication info");
            }
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        } finally {
            return result;
        }
    }

    public List<StudentAssignmentInfoVo> StudentViewAllAssignments(){
        List<StudentAssignmentInfoVo> result = new ArrayList<>();
        // fetch teacher Id from token
        Long studentId = getIdFromToken();
        if(studentId != null){
            enrolmentRepository.findEnrolmentsById_UserId(studentId)
                    .stream()
                    .forEach(enrolment -> {
                        Long assignmentId = enrolment.getId().getAssignmentId();
                        if(assignmentRepository.findAssignmentById(assignmentId).isPresent()){
                            Assignment assignment = assignmentRepository.findAssignmentById(assignmentId).get();
                            if(assignment.getStatus() != 0){
                                result.add(new StudentAssignmentInfoVo(
                                        assignmentId,
                                        assignment.getName(),
                                        assignment.getDescription(),
                                        assignment.getDueDate(),
                                        userRepository.findUserById(assignment.getTeacherId()).get().getName(),
                                        assignment.getStatus(),
                                        enrolment.getEnrolmentStatus(),
                                        enrolment.getSubmissionURL()
                                ));
                            }
                        } else {
                            throw new BadRequestException("Assignment with Id " + assignmentId + " is not available");
                        }
                    });
            return result;
        } else {
            throw new BadRequestException("Bad Authentication for students view assignments");
        }
    }

    public StudentAssignmentInfoVo StudentViewAssignment(Long assignmentId){
        Long studentId = getIdFromToken();
        if(studentId != null) {
            EnrolmentId enrolmentId = new EnrolmentId(studentId,assignmentId);
            if(enrolmentRepository.findById(enrolmentId).isPresent()){
                Enrolment enrolment = enrolmentRepository.getById(enrolmentId);
                Assignment assignment = enrolment.getAssignment();
                return new StudentAssignmentInfoVo(
                        assignment.getId(),
                        assignment.getName(),
                        assignment.getDescription(),
                        assignment.getDueDate(),
                        userRepository.findUserById(assignment.getTeacherId()).get().getName(),
                        assignment.getStatus(),
                        enrolment.getEnrolmentStatus(),
                        enrolment.getSubmissionURL()
                        );
            } else {
                throw new BadRequestException("Illegal access for student "+studentId+" viewing assignment "+assignmentId);
            }
        } else {
            throw new BadRequestException("Bad Authentication for students view assignments");
        }

    }

}
