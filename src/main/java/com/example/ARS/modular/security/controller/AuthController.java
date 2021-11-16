package com.example.ARS.modular.security.controller;

import com.example.ARS.core.MessageResponse;
import com.example.ARS.modular.security.jwt.JwtResponse;
import com.example.ARS.modular.security.jwt.JwtUtils;
import com.example.ARS.modular.security.UserDetailsImpl;
import com.example.ARS.modular.security.dao.UserRepository;
import com.example.ARS.modular.security.params.LoginParam;
import com.example.ARS.modular.security.params.SignupParam;
import com.example.ARS.pojo.ERole;
import com.example.ARS.pojo.User;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @ApiOperation(value = "Sign in")
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginParam loginParam) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginParam.getEmail(),loginParam.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @ApiOperation(value = "Sign up")
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupParam signupParam) {

        // check username
        if(userRepository.existsByEmail(signupParam.getName())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username has been taken."));
        }

        // check user email
        if(userRepository.existsByEmail(signupParam.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: email is already in use."));
        }

        // Create new user
        ERole eRole = signupParam.getRole() == 0 ? ERole.ROLE_TEACHER: ERole.ROLE_STUDENT;
        User user = new User(
                signupParam.getName(),
                signupParam.getEmail(),
                passwordEncoder.encode(signupParam.getPassword()),
                eRole);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully."));
    }



}
