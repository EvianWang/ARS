package com.example.ARS.modular.teacher.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UpdateAssignmentParam {
    @ApiModelProperty(value = "Assignment id", required = true)
    private Long id;

    @ApiModelProperty(value = "Assignment name", required = true)
    private String name;

    @ApiModelProperty(value = "Assignment description")
    private String description;

    @ApiModelProperty(value = "Assignment due date", required = true)
    private String dueDate;

}
