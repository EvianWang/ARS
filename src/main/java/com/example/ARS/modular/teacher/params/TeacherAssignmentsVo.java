package com.example.ARS.modular.teacher.params;

import com.example.ARS.pojo.Assignment;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class TeacherAssignmentsVo {
    @ApiModelProperty(value = "Assignment list")
    List<Assignment> allAssignmentsForTeacher;
}
