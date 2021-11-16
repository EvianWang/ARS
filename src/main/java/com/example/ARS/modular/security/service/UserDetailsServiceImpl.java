package com.example.ARS.modular.security.service;

import com.example.ARS.modular.security.UserDetailsImpl;
import com.example.ARS.modular.security.dao.UserRepository;
import com.example.ARS.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository){
        this.userRepository = userRepository;
    }

//    @Override
//    @Transactional
//    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
//        User user = userRepository.findUserByName(name)
//                .orElseThrow(() -> new UsernameNotFoundException(String.format("Username %s not found",name)));
//        return UserDetailsImpl.build(user);
//    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("Username %s not found",email)));
        return UserDetailsImpl.build(user);
    }


}
