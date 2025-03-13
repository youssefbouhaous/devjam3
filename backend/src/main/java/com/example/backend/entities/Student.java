package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentID;
    private String name;
    private String username;
    private String password;
    private String email;

    @ManyToMany
    private List<Classroom> classrooms=new ArrayList<>();
}

