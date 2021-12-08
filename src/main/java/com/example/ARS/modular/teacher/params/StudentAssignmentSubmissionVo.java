package com.example.ARS.modular.teacher.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentAssignmentSubmissionVo {
    @ApiModelProperty(value = "Stduent Id")
    private Long studentId;
    @ApiModelProperty(value = "Student Name")
    private String studentName;
    @ApiModelProperty(value = "Submission status")
    private Integer enrolmentStatus;
    @ApiModelProperty(value = "Submission URL")
    private String fileKey;

}
