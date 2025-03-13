package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teacherID;
    private String name;
    private String username;
    private String password;
    private String email;

    @OneToMany(mappedBy = "teacher",  fetch = FetchType.LAZY)
    private List<Classroom> classrooms;
}

