package com.example.backend.service;

import com.example.backend.DTOS.ARExperienceDTO;
import com.example.backend.DTOS.ClassroomDTO;
import com.example.backend.DTOS.StudentDTO;
import com.example.backend.DTOS.TeacherDTO;

import com.example.backend.entities.ARExperience;

import com.example.backend.entities.Classroom;
import com.example.backend.entities.Student;
import com.example.backend.entities.Teacher;

import java.util.List;

public interface AppService {
    TeacherDTO saveTeacher(TeacherDTO teacherDTO);
    StudentDTO saveStudent(StudentDTO studentDTO);
    ARExperienceDTO saveARExperience(ARExperienceDTO arExperienceDTO);
    ClassroomDTO saveClassroom(ClassroomDTO classroomDTO);
    List<TeacherDTO> getAllTeachers();
    List<StudentDTO> getAllStudents();
    List<ClassroomDTO> getAllClassrooms();
    List<ARExperienceDTO> getAllARExperiences();
    TeacherDTO getTeacherById(Long id);
    StudentDTO getStudentById(Long id);
    void deleteTeacherById(Long id);
    void deleteStudentById(Long id);

    TeacherDTO getTeacherByEmail(String email);

    List<ClassroomDTO> getAllClassroomsByTeacherId(Long id);
    ClassroomDTO  addClassroom(ClassroomDTO classroomDTO, Long TeacherId);

    ARExperienceDTO addARExperience(ARExperienceDTO arExperienceDTO,  Long classroomId);

    List<StudentDTO> StudentAndClassroom(Long StudentID, Long ClassroomID);
    ClassroomDTO addStudentInClassroom(Long ClassroomID, Long StudentID);

    TeacherDTO updateTeacher(TeacherDTO teacherDTO);

    StudentDTO updateStudent(StudentDTO studentDTO);

    ARExperienceDTO updateARExperience(ARExperienceDTO arExperienceDTO);

    ClassroomDTO updateClassroom(ClassroomDTO classroomDTO);


    // Add these methods to your AppService interface
    void updateARExperienceFile(Long arExperienceId, String fileName);
    ARExperience getARExperienceById(Long arExperienceId);

}
