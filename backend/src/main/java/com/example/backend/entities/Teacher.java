package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity

@Getter
@Setter
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

    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;
}

