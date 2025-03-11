package com.example.backend.repositories;

import com.example.backend.entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin(origins = "*")
@RepositoryRestResource
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}

