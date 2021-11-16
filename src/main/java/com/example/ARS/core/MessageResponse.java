package com.example.ARS.core;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class MessageResponse {

    @ApiModelProperty(value = "message")
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }
}
