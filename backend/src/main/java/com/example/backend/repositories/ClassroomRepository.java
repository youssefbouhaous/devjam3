package com.example.backend.repositories;

import com.example.backend.entities.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
}
