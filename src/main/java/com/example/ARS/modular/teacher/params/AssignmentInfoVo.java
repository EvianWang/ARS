package com.example.ARS.modular.teacher.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class AssignmentInfoVo {
    @ApiModelProperty(value = "Assignment id")
    private Long id;

    @ApiModelProperty(value = "Assignment name")
    private String name;

    @ApiModelProperty(value = "Assignment description")
    private String description;

    @ApiModelProperty(value = "Assignment due date")
    private String dueDate;

    @ApiModelProperty(value = "Creator's id")
    private Long teacherId;

    @ApiModelProperty(value = "Assignment status")
    private Integer status;
}
