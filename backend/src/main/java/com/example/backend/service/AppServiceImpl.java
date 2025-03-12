package com.example.backend.service;

import com.example.backend.entities.Student;
import com.example.backend.entities.Teacher;
import com.example.backend.repositories.StudentRepository;
import com.example.backend.repositories.TeacherRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class AppServiceImpl implements AppService {

    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    @Override
    public Teacher saveTeacher(Teacher teacher) {
      log.info("saveTeacher");
      return teacherRepository.save(teacher);
    }

    @Override
    public Student saveStudent(Student student) {
        log.info("saveStudent");
        return studentRepository.save(student);
    }

    @Override
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Teacher getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id).orElse(null);
        if (teacher == null) {
            throw new RuntimeException("Teacher not found");
        }
        return teacher;
    }

    @Override
    public Student getStudentById(Long id) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) {
            throw new RuntimeException("Student not found");
        }
        return student;
    }

    @Override
    public void deleteTeacherById(Long id) {
        teacherRepository.deleteById(id);
    }

    @Override
    public void deleteStudentById(Long id) {
        studentRepository.deleteById(id);
    }
}
