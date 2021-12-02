package com.example.ARS.modular.teacher.controller;

import com.example.ARS.core.ResponseData;
import com.example.ARS.modular.security.dao.UserRepository;
import com.example.ARS.modular.security.service.UserService;
import com.example.ARS.modular.teacher.params.*;
import com.example.ARS.modular.teacher.service.AssignmentService;
import com.example.ARS.pojo.Assignment;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@Api(value = "AssignmentController", tags = "Assignment CURD interface")
@RequestMapping(path = "api/teacher/assignment")
@AllArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final UserService userService;

    @ApiOperation(value = "Create assignment")
    @PostMapping("/create")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public void createAssignment(@Valid @RequestBody CreateAssignmentParam createAssignmentParam) {

        Assignment assignment = new Assignment(
                createAssignmentParam.getName(),
                createAssignmentParam.getDescription(),
                createAssignmentParam.getDueDate(),
                createAssignmentParam.getTeacherId()
        );
        assignmentService.TeacherCreateAssignment(assignment);
    }

    @ApiOperation(value = "Delete assignment")
    @DeleteMapping(path = "/{assignmentId}")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public void deleteAssignment(@PathVariable ("assignmentId") Long assignmentId) {

        assignmentService.TeacherDeleteAssignment(assignmentId);
    }

    @ApiOperation(value = "View an assignment")
    @GetMapping(path = "/{assignmentId}")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @ResponseBody
    public ResponseData viewAssignment(@PathVariable ("assignmentId") Long assignmentId) {
        Assignment assignment = assignmentService.TeacherViewAssignment(assignmentId);
        AssignmentInfoVo assignmentInfoVo = new AssignmentInfoVo();
        assignmentInfoVo.setId(assignmentId);
        assignmentInfoVo.setName(assignment.getName());
        assignmentInfoVo.setDescription(assignment.getDescription());
        assignmentInfoVo.setDueDate(assignment.getDueDate());
        assignmentInfoVo.setTeacherId(assignment.getTeacherId());
        assignmentInfoVo.setStatus(assignment.getStatus());
        return ResponseData.success(assignmentInfoVo);
    }

    @ApiOperation(value = "Update assignment info")
    @PutMapping("/update")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public void updateAssignment(@Valid @RequestBody UpdateAssignmentParam updateAssignmentParam) {

        assignmentService.TeacherUpdateAssignment(
                updateAssignmentParam.getId(),
                updateAssignmentParam.getName(),
                updateAssignmentParam.getDescription(),
                updateAssignmentParam.getDueDate());
    }

    @ApiOperation(value = "Update assignment status")
    @PostMapping("/status")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public void updateAssignmentStatus(@Valid @RequestBody ChangeAssignmentStatusParam changeAssignmentStatusParam) {
        assignmentService.TeacherUpdateAssignmentStatus(
                changeAssignmentStatusParam.getId(),
                changeAssignmentStatusParam.getStatus()
        );
    }

    @ApiOperation(value = "View all assignments for teacher")
    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseData viewAllAssignments(){
        List<AssignmentInfoVo> allAssignments = assignmentService.TeacherViewAllAssignments();
        return ResponseData.success(allAssignments);
    }

    @ApiOperation(value = "Add student to assignment")
    @PostMapping("/addstudent")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public void addStudentToAssignment(@Valid @RequestBody AddStudentToAssignmentParam addStudentToAssignmentParam) {
        assignmentService.TeacherAddStudent(
                addStudentToAssignmentParam.getStudentId(),
                addStudentToAssignmentParam.getAssignmentId()
        );
    }

    @ApiOperation(value = "Delete student to assignment")
    @PostMapping("/deletestudent")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public void deleteStudentFromAssignment(@Valid @RequestBody AddStudentToAssignmentParam addStudentToAssignmentParam) {
        assignmentService.TeacherDeleteStudent(
                addStudentToAssignmentParam.getStudentId(),
                addStudentToAssignmentParam.getAssignmentId()
        );
    }

    @ApiOperation(value = "Find students have the assignment")
    @GetMapping("/studentsinassignment/{assignmentId}")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseData viewStudentsInAssignment(@PathVariable ("assignmentId") Long assignmentId) {
        List<StudentInfoVo> students = userService.findAllStudentsInAssignment(assignmentId);
        return ResponseData.success(students);
    }

    @ApiOperation(value = "Find students do not have the assignment")
    @GetMapping("/studentsnotinassignment/{assignmentId}")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseData viewStudentsNotInAssignment(@PathVariable ("assignmentId") Long assignmentId) {
        List<StudentInfoVo> students = userService.findAllStudentsNotInAssignment(assignmentId);
        return ResponseData.success(students);
    }

    @ApiOperation(value = "Search students do not have the assignment")
    @PostMapping("/search/studentsnotinassignment")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseData searchStudentsNotInAssignment(@Valid @RequestBody SearchStudentsNotInAssParam searchStudentsNotInAssParam) {
        List<StudentInfoVo> students = userService.searchStudentsNotInAssignment(
                searchStudentsNotInAssParam.getSearchText(),
                searchStudentsNotInAssParam.getAssignmentId());
        return ResponseData.success(students);
    }


}
