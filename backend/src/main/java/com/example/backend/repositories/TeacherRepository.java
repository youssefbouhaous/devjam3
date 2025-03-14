package com.example.backend.repositories;

import com.example.backend.entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Teacher findByEmail(String email);

}

