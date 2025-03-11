package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentID;
    private String name;
    private String username;
    private String password;
    private String email;

    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;
}

