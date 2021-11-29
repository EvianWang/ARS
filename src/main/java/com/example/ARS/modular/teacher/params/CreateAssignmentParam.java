package com.example.ARS.modular.teacher.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CreateAssignmentParam {
    @ApiModelProperty(value = "Assignment name", required = true)
    private String name;

    @ApiModelProperty(value = "Assignment description")
    private String description;

    @ApiModelProperty(value = "Assignment due date", required = true)
    private String dueDate;

    @ApiModelProperty(value = "Assigned by", required = true)
    private Long teacherId;

}
