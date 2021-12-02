package com.example.ARS.modular.teacher.service;

import com.example.ARS.exception.BadRequestException;
import com.example.ARS.modular.security.UserDetailsImpl;
import com.example.ARS.modular.security.dao.UserRepository;
import com.example.ARS.modular.teacher.dao.AssignmentRepository;
import com.example.ARS.modular.teacher.dao.EnrolmentRepository;
import com.example.ARS.modular.teacher.params.AssignmentInfoVo;
import com.example.ARS.pojo.Assignment;
import com.example.ARS.pojo.Enrolment;
import com.example.ARS.pojo.EnrolmentId;
import com.example.ARS.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class AssignmentService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AssignmentRepository assignmentRepository;

    @Autowired
    EnrolmentRepository enrolmentRepository;

    @Autowired
    public AssignmentService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

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

    public Boolean checkTeacherIdentity(Long assignmentId) {
        Boolean result = true;
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetailsImpl) {
                // find the email in the jwt token
                String email = ((UserDetailsImpl) principal).getUsername();
                if (assignmentRepository.findAssignmentById(assignmentId).isPresent()) {
                    Assignment a = assignmentRepository.findAssignmentById(assignmentId).get();
                    Long teacherId = a.getTeacherId();
                    // find the user with the teacher ID and check if they are equal
                    if (userRepository.findUserById(teacherId).isPresent()) {
                        User user = userRepository.findUserById(teacherId).get();
                        result = email.equals(user.getEmail());
                    } else {
                        throw new BadRequestException("Assignment creator does not exist in user repo");
                    }
                } else {
                    throw new BadRequestException("Assignment does not exists with id " + assignmentId);
                }
            } else {
                throw new BadRequestException("Illegal authentication info for viewing assignment with Id " + assignmentId);
            }
        } catch (Exception e) {
            result = false;
            throw new BadRequestException(e.getMessage());
        } finally {
            return result;
        }

    }

    public void TeacherCreateAssignment(Assignment assignment) {
        // check if name is taken
        Boolean existsAssignmentName = assignmentRepository.selectExistsByName(assignment.getName());
        if (existsAssignmentName) {
            throw new BadRequestException("The assignment name " + assignment.getName() + "has been taken");
        }

        // check if date is in correct format
        Boolean dateMatches = Pattern.matches("^(\\d{4})-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$", assignment.getDueDate());
        if (!dateMatches) {
            throw new BadRequestException("The assignment due date " + assignment.getDueDate() + "is not valid (YYYY-MM-DD)");
        }

        // check if date is behind the current date
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            Date d1 = sdf.parse(assignment.getDueDate());
            Date d2 = sdf.parse(LocalDate.now().toString());

            if (d1.before(d2)) {
                throw new BadRequestException("The assignment due date has passed");
            }
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }

        userRepository.findUserById(assignment.getTeacherId())
                .ifPresent(teacher -> {
                    teacher.addEnrolment(new Enrolment(teacher, assignment));
                });
        assignmentRepository.save(assignment);
    }

    public void TeacherDeleteAssignment(Long assignmentId) {
        if (checkTeacherIdentity(assignmentId)) {
            Assignment assignment = assignmentRepository.findAssignmentById(assignmentId).get();
            User teacher = userRepository.findUserById(assignment.getTeacherId()).get();
            Enrolment enrolment = enrolmentRepository.getById(new EnrolmentId(assignmentId, teacher.getId()));
            teacher.removeEnrolment(enrolment);
            assignmentRepository.deleteById(assignmentId);
        } else {
            throw new BadRequestException("Illegal authentication info for deleting assignment with Id " + assignmentId);
        }
    }

    public Assignment TeacherViewAssignment(Long assignmentId) {
        if (checkTeacherIdentity(assignmentId)) {
            Assignment assignment = assignmentRepository.findAssignmentById(assignmentId).get();
            return assignment;
        } else {
            throw new BadRequestException("Illegal authentication info for viewing assignment with Id " + assignmentId);
        }
    }

    public void TeacherUpdateAssignment(Long assignmentId, String name, String description, String dueDate) {
        if (checkTeacherIdentity(assignmentId)) {
            Assignment assignment = assignmentRepository.findAssignmentById(assignmentId).get();
            assignment.setName(name);
            assignment.setDescription(description);
            assignment.setDueDate(dueDate);
            assignmentRepository.save(assignment);
        } else {
            throw new BadRequestException("Illegal authentication info for updating assignment with Id " + assignmentId);
        }
    }

    public void TeacherUpdateAssignmentStatus(Long assignmentId, Integer status) {
        if (checkTeacherIdentity(assignmentId)) {
            Assignment assignment = assignmentRepository.findAssignmentById(assignmentId).get();
            // 0:created, 1:released, 2:finished
            if (status >= 0 && status <= 2) {
                assignment.setStatus(status);
                assignmentRepository.save(assignment);
            } else {
                throw new BadRequestException("Invalid status change request for assignment with Id" + assignmentId + ", status: " + status);
            }
        } else {
            throw new BadRequestException("Illegal authentication info for updating status of assignment with Id " + assignmentId);
        }
    }

    public List<AssignmentInfoVo> TeacherViewAllAssignments() {
        List<AssignmentInfoVo> result = new ArrayList<>();
        // fetch teacher Id from token
        Long teacherId = getIdFromToken();
        if (teacherId != null) {
            // fetch list of assignments with teacherId
            assignmentRepository.findAssignmentsByTeacherId(teacherId)
                    .stream()
                    .forEach(assignment -> {
                        result.add(new AssignmentInfoVo(
                                assignment.getId(),
                                assignment.getName(),
                                assignment.getDescription(),
                                assignment.getDueDate(),
                                teacherId,
                                assignment.getStatus()));
                    });
        } else {
            throw new BadRequestException("User in token is not found");
        }
        return result;
    }

    public void TeacherAddStudent(Long studentId, Long assignmentId) {
        // find the assignment
        if (!assignmentRepository.findAssignmentById(assignmentId).isPresent()) {
            throw new BadRequestException("Assignment with id " + assignmentId + " is not found");
        }

        // find the students and add the assignment to them
        if (!userRepository.findUserById(studentId).isPresent()) {
            throw new BadRequestException("Student with id " + studentId + " is not found");
        }

        User student = userRepository.findUserById(studentId).get();
        Assignment assignment = assignmentRepository.findAssignmentById(assignmentId).get();
        student.addEnrolment(new Enrolment(student,assignment));
        userRepository.save(student);
    }

    public void TeacherDeleteStudent(Long studentId, Long assignmentId) {
        // find the assignment
        if (!assignmentRepository.findAssignmentById(assignmentId).isPresent()) {
            throw new BadRequestException("Assignment with id " + assignmentId + " is not found");
        }

        // find the students and add the assignment to them
        if (!userRepository.findUserById(studentId).isPresent()) {
            throw new BadRequestException("Student with id " + studentId + " is not found");
        }
        enrolmentRepository.deleteById(new EnrolmentId(studentId,assignmentId));
    }
}

