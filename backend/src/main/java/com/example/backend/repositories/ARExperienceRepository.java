package com.example.backend.repositories;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entities.ARExperience;

@RepositoryRestResource(path = "ar-experiences")
public interface ARExperienceRepository extends JpaRepository<ARExperience, Long> {
}
