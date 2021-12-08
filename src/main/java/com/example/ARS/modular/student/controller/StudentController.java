package com.example.ARS.modular.student.controller;

import com.example.ARS.core.ResponseData;
import com.example.ARS.modular.student.params.GradeVo;
import com.example.ARS.modular.student.params.RequestGradeParam;
import com.example.ARS.modular.student.service.StudentService;
import com.example.ARS.modular.teacher.params.StudentAssignmentInfoVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@Api(value = "StudentController", tags = "Student assignment interface")
@RequestMapping(path = "api/student/assignment")
@AllArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @ApiOperation(value = "View all assignments")
    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseData viewAllAssignments() {
        List<StudentAssignmentInfoVo> allAssignments = studentService.StudentViewAllAssignments();
        return ResponseData.success(allAssignments);
    }

    @ApiOperation(value = "View an assignment")
    @GetMapping("/{assignmentId}")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseData viewAssignment(@PathVariable ("assignmentId") Long assignmentId){
        StudentAssignmentInfoVo assignmentInfo = studentService.StudentViewAssignment(assignmentId);
        return ResponseData.success(assignmentInfo);
    }

    @ApiOperation(value = "Get assignment grade")
    @PostMapping("/grade")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseData viewGrade(@Valid @RequestBody RequestGradeParam requestGradeParam){
        GradeVo gradeVo = studentService.getAssignmentGrade(requestGradeParam.getStudentId(),requestGradeParam.getAssignmentId());
        return ResponseData.success(gradeVo);
    }

}
