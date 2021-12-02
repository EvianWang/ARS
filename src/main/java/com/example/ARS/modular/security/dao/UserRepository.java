package com.example.ARS.modular.security.dao;

import com.example.ARS.pojo.ERole;
import com.example.ARS.pojo.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findUserById(Long id);

    Optional<User> findUserByEmail(String email);

    List<User> findUsersByRole(ERole eRole);

    Boolean existsByEmail(String email);

    Boolean existsByName(String name);
}
