package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ARExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long experienceID;
    private String name;
    private String description;
    private String file;

    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;
}
