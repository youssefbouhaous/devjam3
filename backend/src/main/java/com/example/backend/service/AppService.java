package com.example.backend.service;

import com.example.backend.entities.Student;
import com.example.backend.entities.Teacher;

import java.util.List;

public interface AppService {
    Teacher saveTeacher(Teacher teacher);
    Student saveStudent(Student student);
    List<Teacher> getAllTeachers();
    List<Student> getAllStudents();
    Teacher getTeacherById(Long id);
    Student getStudentById(Long id);
    void deleteTeacherById(Long id);
    void deleteStudentById(Long id);

}
