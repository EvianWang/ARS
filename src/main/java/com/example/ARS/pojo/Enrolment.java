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

    public Enrolment(User user, Assignment assignment) {
        this.user = user;
        this.assignment = assignment;
    }
}
