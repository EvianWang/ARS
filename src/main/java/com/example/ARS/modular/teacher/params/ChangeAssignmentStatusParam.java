package com.example.ARS.modular.teacher.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ChangeAssignmentStatusParam {
    @ApiModelProperty(value = "Assignment id", required = true)
    private Long id;

    @ApiModelProperty(value = "New status", required = true)
    private Integer status;
}
