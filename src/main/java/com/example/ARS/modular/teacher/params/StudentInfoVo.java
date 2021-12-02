package com.example.ARS.modular.teacher.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentInfoVo {
    @ApiModelProperty(value = "Student Id")
    private Long id;

    @ApiModelProperty(value = "Student name")
    private String name;

    @ApiModelProperty(value = "Student email")
    private String email;
}
