package com.example.ARS.pojo;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_table")
public class User {
    @Id
    @SequenceGenerator(
            name = "user_sequence",
            sequenceName = "user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_sequence")
    private Long id;

    @Column(nullable = false)
    @NotNull(message = "name can not be empty")
    private String name;

    @Email
    @Column(nullable = false, unique = true)
    @NotNull(message = "email can not be empty")
    private String email;

    @Column(nullable = false)
    @NotNull(message = "password can not be empty")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole role;

    @ManyToMany(
            cascade = {CascadeType.ALL}
    )
    @JoinTable(
            name = "has_assignment",
            joinColumns = @JoinColumn(
                    name = "user_id",
                    foreignKey = @ForeignKey(name = "has_assignment_user_id_fk")
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "assignment_id",
                    foreignKey = @ForeignKey(name = "has_assignment_assignment_id_fk")
            )
    )
    private List<Assignment> assignments = new ArrayList<>();

    public User(String name, String email, String password, ERole role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public void addAssignment(Assignment assignment){
        assignments.add(assignment);
        assignment.getUsers().add(this);
    }

    public void removeAssignment(Assignment assignment){
        assignments.remove(assignment);
        assignment.getUsers().remove(this);
    }
}
