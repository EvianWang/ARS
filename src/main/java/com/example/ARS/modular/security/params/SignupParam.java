package com.example.ARS.modular.security.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class SignupParam {
    @ApiModelProperty(value = "User name", required = true)
    private String name;
    @ApiModelProperty(value = "User email", required = true)
    private String email;
    @ApiModelProperty(value = "Password", required = true)
    private String password;
    @ApiModelProperty(value = "Role", required = true)
    private Integer role;
}
