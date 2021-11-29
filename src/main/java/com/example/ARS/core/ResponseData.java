package com.example.ARS.core;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@ApiModel("ResponseData")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@ToString
public class ResponseData<T> {
    public static final String DEFAULT_SUCCESS_MESSAGE = "request succeeded";
    public static final String DEFAULT_ERROR_MESSAGE = "server error";
    public static final Integer DEFAULT_SUCCESS_CODE = 200;
    public static final Integer DEFAULT_ERROR_CODE = 400;
    public static final ResponseData SUCCESS_DATA = new ResponseData(true,DEFAULT_SUCCESS_CODE,DEFAULT_SUCCESS_MESSAGE,null);
    public static final ResponseData ERROR_DATA = new ResponseData(false,DEFAULT_ERROR_CODE,DEFAULT_ERROR_MESSAGE,null);

    private Boolean success;
    @ApiModelProperty(value = "status code")
    private Integer code;
    @ApiModelProperty(value = "message")
    private String message;
    private T data;

    // success
    public static ResponseData success() { return SUCCESS_DATA; }

    public static <T> ResponseData success(T object) {
        return new ResponseData(true, DEFAULT_SUCCESS_CODE, DEFAULT_SUCCESS_MESSAGE, object);
    }

    public static <T> ResponseData success(String message){
        return new ResponseData(true, DEFAULT_SUCCESS_CODE, message, null);
    }

    public static <T> ResponseData success(Integer code, String message, T object){
        return new ResponseData(true,code,message,object);
    }

    // failure
    public static ResponseData error() { return ERROR_DATA; }

    public static <T> ResponseData error(T object) {
        return new ResponseData(false, DEFAULT_ERROR_CODE, DEFAULT_ERROR_MESSAGE, object);
    }

    public static <T> ResponseData error(String message){
        return new ResponseData(false, DEFAULT_ERROR_CODE, message, null);
    }

    public static <T> ResponseData error(Integer code, String message, T object){
        return new ResponseData(false,code,message,object);
    }
}
