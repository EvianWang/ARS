package com.example.ARS.modular.teacher.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class AddStudentsToAssignmentParam {
    @ApiModelProperty(value = "Student Ids", required = true)
    private List<Long> studentIds;

    @ApiModelProperty(value = "Assignment Id", required = true)
    private Long assignmentId;
}
