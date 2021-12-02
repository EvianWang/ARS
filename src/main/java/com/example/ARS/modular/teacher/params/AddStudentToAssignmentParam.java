package com.example.ARS.modular.teacher.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
public class AddStudentToAssignmentParam {
    @ApiModelProperty(value = "Student Id", required = true)
    private Long studentId;

    @ApiModelProperty(value = "Assignment Id", required = true)
    private Long assignmentId;
}
