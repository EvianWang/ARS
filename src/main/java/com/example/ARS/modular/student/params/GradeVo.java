package com.example.ARS.modular.student.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GradeVo {
    @ApiModelProperty(value = "comment")
    private String comment;
    @ApiModelProperty(value = "grade")
    private Double grade;
}
