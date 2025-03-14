package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
// Update your ARExperience entity
@Entity
@Data
public class ARExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long experienceID;
    private String name;
    private String description;

    // Updated file field
    private String file; // Store file name instead of byte array

    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;
}