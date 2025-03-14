package com.example.backend.repositories;

import com.example.backend.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;





public interface StudentRepository extends JpaRepository<Student, Long> {
}