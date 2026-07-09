



package com.mydev.ecommerce.user.controller;

import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepo;

    public AdminUserController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    /*
        GET ALL USERS
    */
    @GetMapping
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    /*
        GET SINGLE USER
    */
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {

        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /*
        UPDATE USER
    */
@PutMapping("/{id}")
public User updateUser(
        @PathVariable Long id,
        @RequestBody User updatedUser
) {

    User u = userRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // allow admin to edit these fields
    u.setName(updatedUser.getName());
    u.setPhone(updatedUser.getPhone());
    u.setRole(updatedUser.getRole());

    // NEW
    u.setEmail(updatedUser.getEmail());

    return userRepo.save(u);
} 

    /*
        DELETE USER
    */
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        User u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepo.delete(u);

        return "User deleted";
    }
}