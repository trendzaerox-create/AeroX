


package com.mydev.ecommerce.user.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 120)
  private String name;

  @Column(nullable = false, unique = true, length = 180)
  private String email;

  @Column(name="password_hash", nullable = false, length = 255)
  private String passwordHash;

  @Column(nullable = false, length = 30)
  private String role;

  @Column(length = 20)
  private String phone;

  @Column(name="created_at", nullable = false)
  private OffsetDateTime createdAt;
}