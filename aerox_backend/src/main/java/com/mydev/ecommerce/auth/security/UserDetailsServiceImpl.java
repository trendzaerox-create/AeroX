package com.mydev.ecommerce.auth.security;

import com.mydev.ecommerce.user.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  private final UserRepository userRepo;

  public UserDetailsServiceImpl(UserRepository userRepo) {
    this.userRepo = userRepo;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    var u = userRepo.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

   
    return new org.springframework.security.core.userdetails.User(
    u.getEmail(),
    u.getPasswordHash(),
    List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole()))
);
  }
}