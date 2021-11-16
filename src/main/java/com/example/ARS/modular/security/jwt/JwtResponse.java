package com.example.ARS.modular.security.jwt;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@ApiModel("JwtResponse")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {

    @ApiModelProperty(value = "Jwt token")
    private String jwt;
    @ApiModelProperty(value = "User id")
    private Long id;
    @ApiModelProperty(value = "User name")
    private String name;
    @ApiModelProperty(value = "User email")
    private String email;
    @ApiModelProperty(value = "User role")
    private List<String> role;
    private String type = "Bearer";

    public JwtResponse(String jwt, Long id, String name, String email, List<String> role){
        this.jwt = jwt;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

}
