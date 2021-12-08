package com.example.ARS.modular.student.controller;

import com.example.ARS.core.ResponseData;
import com.example.ARS.modular.s3.AwsS3Service;
import com.example.ARS.modular.student.service.StudentService;
import com.example.ARS.modular.teacher.params.StudentAssignmentInfoVo;
import com.example.ARS.modular.teacher.service.AssignmentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkClientException;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@Api(value = "StudentController", tags = "Student assignment interface")
@RequestMapping(path = "api/student/assignment")
@AllArgsConstructor
public class StudentController {

    private final AssignmentService assignmentService;
    private final StudentService studentService;
    private final AwsS3Service awsS3Service;

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

    @ApiOperation(value = "Submit assignment")
    @PostMapping("/submit")
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseData submitAssignment(@RequestParam(value="file")MultipartFile file, Long assignmentId, Long studentId){
        try {
            awsS3Service.uploadFile(assignmentId, studentId, file, true);
        } catch (SdkClientException e) {
            e.printStackTrace();
            return ResponseData.error(e.getMessage());
        }
        return ResponseData.success("File uploaded.");
    }

    @ApiOperation(value="Download file")
    @GetMapping("/download/{fileKey}")
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileKey) {
        byte[] data = awsS3Service.downloadFile(fileKey);
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type","application/octet-stream")
                .header("Content-disposition","attachment; filename=\"" + fileKey + "\"")
                .body(resource);
    }

    @ApiOperation(value = "Delete file")
    @DeleteMapping("/delete/{fileKey}")
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseData deleteFile(@PathVariable String fileKey) {
        return ResponseData.success(awsS3Service.deleteFile(fileKey));
    }


}
