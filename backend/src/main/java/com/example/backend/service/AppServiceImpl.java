package com.example.backend.service;

import com.example.backend.DTOS.ARExperienceDTO;
import com.example.backend.DTOS.ClassroomDTO;
import com.example.backend.DTOS.StudentDTO;
import com.example.backend.DTOS.TeacherDTO;
import com.example.backend.entities.ARExperience;
import com.example.backend.entities.Classroom;
import com.example.backend.entities.Student;
import com.example.backend.entities.Teacher;
import com.example.backend.mappers.AppMapper;
import com.example.backend.repositories.ARExperienceRepository;
import com.example.backend.repositories.ClassroomRepository;
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
    private final ClassroomRepository classroomRepository;
    private final ARExperienceRepository arExperienceRepository;
    private AppMapper appMapper;

    @Override
    public TeacherDTO saveTeacher(TeacherDTO teacherDTO) {
      log.info("saveTeacher");
      Teacher teacher = appMapper.toTeacher(teacherDTO);
      teacherRepository.save(teacher);
      return appMapper.toTeacherDTO(teacher);
    }

    @Override
    public StudentDTO saveStudent(StudentDTO studentDTO) {
        log.info("saveStudent");
        Student student = appMapper.toStudent(studentDTO);
        studentRepository.save(student);
        return appMapper.toStudentDTO(student);
    }

    @Override
    public ARExperienceDTO saveARExperience(ARExperienceDTO arExperienceDTO) {
        log.info("saveARExperience");
        ARExperience arExperience = appMapper.toARExperience(arExperienceDTO);
        arExperienceRepository.save(arExperience);
        return appMapper.toARExperienceDTO(arExperience);

    }

    @Override
    public ClassroomDTO saveClassroom(ClassroomDTO classroomDTO) {
        Classroom classroom = appMapper.toClassroom(classroomDTO);
        classroomRepository.save(classroom);
        return appMapper.toClassroomDTO(classroom);
    }

    @Override
    public List<TeacherDTO> getAllTeachers() {
        return appMapper.toTeacherDTO(teacherRepository.findAll());
    }

    @Override
    public List<StudentDTO> getAllStudents() {

        return appMapper.toStudentDTO(studentRepository.findAll());
    }

    @Override
    public List<ClassroomDTO> getAllClassrooms() {
        return appMapper.toClassroomDTO(classroomRepository.findAll());
    }

    @Override
    public List<ARExperienceDTO> getAllARExperiences() {
        return appMapper.toARExperienceDTO(arExperienceRepository.findAll());
    }

    @Override
    public TeacherDTO getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id).orElse(null);
        if (teacher == null) {
            throw new RuntimeException("Teacher not found");
        }

        return appMapper.toTeacherDTO(teacher);
    }

    @Override
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) {
            throw new RuntimeException("Student not found");
        }
        return appMapper.toStudentDTO(student);
    }

    @Override
    public void deleteTeacherById(Long id) {
        teacherRepository.deleteById(id);
    }

    @Override
    public void deleteStudentById(Long id) {
        studentRepository.deleteById(id);
    }

    @Override
    public TeacherDTO getTeacherByEmail(String email) {
        Teacher teacher = teacherRepository.findByEmail(email);
        if (teacher == null) {
            throw new RuntimeException("Teacher not found with email: " + email);
        }
        return appMapper.toTeacherDTO(teacher);
    }

    @Override
    public List<ClassroomDTO> getAllClassroomsByTeacherId(Long id) {
        Teacher teacher = teacherRepository.findById(id).orElse(null);
        if (teacher == null) {
            throw new RuntimeException("Teacher not found with id: " + id);
        }
        List<Classroom> classrooms = teacher.getClassrooms();
        return appMapper.toClassroomDTO(classrooms);

    }

    @Override
    public ClassroomDTO addClassroom(ClassroomDTO classroomDTO, Long TeacherId) {
        Teacher teacher = teacherRepository.findById(TeacherId).orElse(null);
        if (teacher == null) {
            throw new RuntimeException("Teacher not found with id: " + TeacherId);
        }
        Classroom classroom = appMapper.toClassroom(classroomDTO);
        teacher.getClassrooms().add(classroom);
        classroom.setTeacher(teacher);
        teacherRepository.save(teacher);
        return appMapper.toClassroomDTO(classroomRepository.save(classroom));

    }

    @Override
    public ARExperienceDTO addARExperience(ARExperienceDTO arExperienceDTO, Long classroomId) {
        Classroom classroom = classroomRepository.findById(classroomId).orElse(null);
        if (classroom == null) {
            throw new RuntimeException("Classroom not found with id: " + classroomId);
        }
        ARExperience  arExperience = appMapper.toARExperience(arExperienceDTO);
        arExperience.setClassroom(classroom);
        classroom.getArExperiences().add(arExperience);

        classroomRepository.save(classroom);
        return appMapper.toARExperienceDTO(arExperienceRepository.save(arExperience));

    }


}
