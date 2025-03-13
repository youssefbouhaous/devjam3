package com.example.backend.DTOS;

import com.example.backend.entities.Classroom;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDTO {
    private Long teacherID;
    private String name;
    private String username;
    private String password;
    private String email;
}

