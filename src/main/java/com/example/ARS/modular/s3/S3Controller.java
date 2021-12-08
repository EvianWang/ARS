package com.example.ARS.modular.s3;

import com.example.ARS.core.ResponseData;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkClientException;

@RestController
@Api(value = "S3Controller", tags = "AWS S3 interface")
@RequestMapping(path = "api/s3/assignment")
@AllArgsConstructor
public class S3Controller {

    private final AwsS3Service awsS3Service;

    @ApiOperation(value = "Submit assignment")
    @PostMapping("/submit")
    @ResponseBody
    public ResponseData submitAssignment(@RequestParam(value="file") MultipartFile file, Long assignmentId, Long studentId){
        try {
            awsS3Service.uploadFile(assignmentId, studentId, file, true);
        } catch (SdkClientException e) {
            e.printStackTrace();
            return ResponseData.error(e.getMessage());
        }
        return ResponseData.success("File uploaded.");
    }

    @ApiOperation(value="Download file")
    @GetMapping("/download/{fileKey}")
    @ResponseBody
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileKey) {
        byte[] data = awsS3Service.downloadFile(fileKey);
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type","application/octet-stream")
                .header("Content-disposition","attachment; filename=\"" + fileKey + "\"")
                .body(resource);
    }

    @ApiOperation(value = "Delete file")
    @DeleteMapping("/delete/{fileKey}")
    @ResponseBody
    public ResponseData deleteFile(@PathVariable String fileKey) {
        return ResponseData.success(awsS3Service.deleteFile(fileKey));
    }
}
