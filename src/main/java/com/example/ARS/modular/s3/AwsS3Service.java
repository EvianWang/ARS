package com.example.ARS.modular.s3;


import com.example.ARS.exception.BadRequestException;
import com.example.ARS.modular.teacher.dao.EnrolmentRepository;
import com.example.ARS.pojo.Enrolment;
import com.example.ARS.pojo.EnrolmentId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.utils.IoUtils;

import java.io.IOException;
import java.util.ArrayList;

@Service
public class AwsS3Service {

    @Value("${amazon.s3.bucket}")
    private String awsBucket;
    @Autowired
    private S3Client s3Client;
    @Autowired
    private EnrolmentRepository enrolmentRepository;

    // upload assignment description file / submission file
    public PutObjectResponse uploadFile(Long assignmentId, Long userId, MultipartFile file, Boolean isSubmission) {
        String fileKey;
//        if(!isSubmission){
//            fileKey = "assignment/" + assignmentId.toString() + "-" + userId.toString() + "-" + file.getOriginalFilename();
//        } else {
//            fileKey = "submission/" + assignmentId.toString() + "-" + userId.toString() + "-" + file.getOriginalFilename();
//        }
        fileKey = assignmentId.toString() + "-" + userId.toString() + "-" + file.getOriginalFilename();
        try{
          s3Client.putObject(
                  PutObjectRequest.builder().bucket(awsBucket).key(fileKey).build(),
                  RequestBody.fromBytes(file.getBytes()));
        } catch (IOException e){
            e.printStackTrace();
        } catch (SdkClientException e) {
            throw new BadRequestException(e.getMessage());
        }
        // update the submission url
        Enrolment enrolment = enrolmentRepository.getById(new EnrolmentId(userId,assignmentId));
        enrolment.setSubmissionURL(fileKey);
        // change the enrolment status
        if(isSubmission) enrolment.setEnrolmentStatus(1);
        enrolmentRepository.save(enrolment);
        return null;
    }

    // download file
    public byte[] downloadFile(String fileKey){
        ResponseInputStream<GetObjectResponse> responseInputStream = null;
        try{
            responseInputStream = s3Client.getObject(GetObjectRequest.builder().bucket(awsBucket).key(fileKey).build());
            byte[] content = IoUtils.toByteArray(responseInputStream);
            return content;
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("here");
        }
        return null;
    }

    // delete file
    public String deleteFile(String fileKey) {
        ArrayList<ObjectIdentifier> toDelete = new ArrayList<>();
        toDelete.add(ObjectIdentifier.builder().key(fileKey).build());
        try{
            DeleteObjectsRequest dor = DeleteObjectsRequest.builder()
                    .bucket(awsBucket)
                    .delete(Delete.builder().objects(toDelete).build())
                    .build();
            s3Client.deleteObjects(dor);
        } catch (Exception e){
            e.printStackTrace();
        }
        return toDelete.toString() + " are removed.";
     }
}
