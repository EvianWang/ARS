package com.example.ARS.modular.teacher.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class MarkAssignmentParam {
    @ApiModelProperty(value = "Student Id", required = true)
    private Long studentId;

    @ApiModelProperty(value = "Assignment Id", required = true)
    private Long assignmentId;

    @ApiModelProperty(value = "grade", required = true)
    private Double grade;

    @ApiModelProperty(value = "comment")
    private String comment;
}
