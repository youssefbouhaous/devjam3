package com.example.backend.DTOS;

import com.example.backend.entities.Classroom;
import jakarta.persistence.*;
import lombok.Data;


@Data
public class ARExperienceDTO {
    private Long experienceID;
    private String name;
    private String description;
    private String file;
}
