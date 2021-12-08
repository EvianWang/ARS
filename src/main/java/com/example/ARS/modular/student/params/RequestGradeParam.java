package com.example.ARS.modular.student.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class RequestGradeParam {
    @ApiModelProperty(value = "Student Id", required = true)
    private Long studentId;

    @ApiModelProperty(value = "Assignment Id", required = true)
    private Long assignmentId;
}
