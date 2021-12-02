package com.example.ARS.pojo;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Entity
@Table(name = "assignment_table")
public class Assignment {
    @Id
    @SequenceGenerator(
            name = "assignment_sequence",
            sequenceName = "assignment_sequence",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "assignment_sequence")
    private Long id;

    @Column(name = "name", nullable = false)
    @NotNull(message = "assignment name can not be empty")
    private String name;

    @Column(name = "description",length = 750)
    private String description;

    @Column(name = "dueDate")
    @NotNull(message = "due date can not be empty")
    private String dueDate;

    @Column(name = "teacherId")
    @NotNull(message = "assignment creator's id is needed")
    private Long teacherId;

    @Column(name = "status")
    private int status;

    @OneToMany(
            cascade = {CascadeType.ALL},
            mappedBy = "assignment"
    )
    private List<Enrolment> enrolments = new ArrayList<>();

    public Assignment (String name, String description, String dueDate, Long teacherId){
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
        this.teacherId = teacherId;
        this.status = 0;
    }

    public void addEnrolment(Enrolment enrolment){
        if(!enrolments.contains(enrolment)){
            enrolments.add(enrolment);
        }
    }

    public void removeEnrolment(Enrolment enrolment){
        enrolments.remove(enrolment);
    }
}
