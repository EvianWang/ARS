package com.example.ARS.pojo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity(name = "Enrolment")
@Table(name = "enrolment")
@NoArgsConstructor
@Getter
@Setter
public class Enrolment {

    @EmbeddedId
    private EnrolmentId id = new EnrolmentId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("assignmentId")
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @Column(
            name = "is_student",
            nullable = false
    )
    private Boolean isStudent;

    @Column(
            name = "enrolement_status",
            nullable = false
    )
    // 0: unsubmitted, 1: submitted, 2: marked, 3: missed
    private Integer enrolmentStatus;

    @Column(
            name = "submission_url"
    )
    private String submissionURL;


    public Enrolment(User user, Assignment assignment, Boolean isStudent, Integer enrolmentStatus) {
        this.user = user;
        this.assignment = assignment;
        this.isStudent = isStudent;
        this.enrolmentStatus = enrolmentStatus;
        this.submissionURL = null;
    }
}
