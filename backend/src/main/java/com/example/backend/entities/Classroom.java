package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long classroomID;
    private String name;
    private String description;

    @OneToMany(mappedBy = "classroom")
    private List<Student> students;

    @OneToMany(mappedBy = "classroom")
    private List<Teacher> teachers;
}