package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long classroomID;
    private String name;
    private String description;

    @ManyToMany
    private List<Student> students=new ArrayList<>();

    @OneToMany(mappedBy = "classroom")
    private List<Teacher> teachers;
}