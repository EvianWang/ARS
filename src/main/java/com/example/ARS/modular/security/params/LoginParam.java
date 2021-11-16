package com.example.ARS.modular.security.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class LoginParam {

    @ApiModelProperty(value = "email", required = true)
    private String email;
    @ApiModelProperty(value = "password", required = true)
    private String password;

}
