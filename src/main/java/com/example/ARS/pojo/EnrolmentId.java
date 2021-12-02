package com.example.ARS.pojo;

import lombok.*;
import lombok.extern.apachecommons.CommonsLog;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class EnrolmentId implements Serializable {
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "assignment_id")
    private Long assignmentId;

}
