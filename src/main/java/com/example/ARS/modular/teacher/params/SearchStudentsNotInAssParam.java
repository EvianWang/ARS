package com.example.ARS.modular.teacher.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class SearchStudentsNotInAssParam {
    @ApiModelProperty(value = "Search Text")
    private String searchText;

    @ApiModelProperty(value = "Assignment Id")
    private Long assignmentId;
}
