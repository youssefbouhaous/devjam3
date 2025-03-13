package com.example.backend.repositories;

import com.example.backend.entities.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ClassroomRepository extends JpaRepository<Classroom, Long> {

    List<Classroom> findByTeacher_TeacherID(Long teacherID);
}
