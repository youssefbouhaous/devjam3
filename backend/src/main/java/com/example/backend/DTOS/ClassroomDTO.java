package com.example.backend.DTOS;

import com.example.backend.entities.Student;
import com.example.backend.entities.Teacher;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class ClassroomDTO {
    private Long classroomID;
    private String name;
    private String description;
}