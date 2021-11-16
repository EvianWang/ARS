package com.example.ARS.pojo;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

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

    public User(String name, String email, String password, ERole role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
