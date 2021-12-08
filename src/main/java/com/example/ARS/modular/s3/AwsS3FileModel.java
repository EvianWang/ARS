package com.example.ARS.modular.s3;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class AwsS3FileModel {
    @ApiModelProperty(value = "File Size")
    private long fileSize;
    @ApiModelProperty(value = "File name")
    private String fileName;
    @ApiModelProperty(value = "File URL")
    private String url;
    @ApiModelProperty(value = "File path")
    private String filePath;
    @ApiModelProperty(value = "File type")
    private String fileType;
}
