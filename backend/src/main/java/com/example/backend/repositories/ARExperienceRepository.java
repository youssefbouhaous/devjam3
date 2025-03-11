package com.example.backend.repositories;

import com.example.backend.entities.ARExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ARExperienceRepository extends JpaRepository<ARExperience, Long> {
}