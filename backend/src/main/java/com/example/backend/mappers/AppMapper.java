package com.example.backend.mappers;


import com.example.backend.DTOS.ARExperienceDTO;
import com.example.backend.DTOS.ClassroomDTO;
import com.example.backend.DTOS.StudentDTO;
import com.example.backend.DTOS.TeacherDTO;
import com.example.backend.entities.ARExperience;
import com.example.backend.entities.Classroom;
import com.example.backend.entities.Student;
import com.example.backend.entities.Teacher;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;

import java.util.List;

@Service
public class AppMapper {
    public TeacherDTO toTeacherDTO(Teacher teacher) {
        TeacherDTO teacherDTO=new TeacherDTO();
        teacherDTO.setTeacherID(teacher.getTeacherID());
        teacherDTO.setName(teacher.getName());
        teacherDTO.setUsername(teacher.getUsername());
        teacherDTO.setPassword(teacher.getPassword());
        teacherDTO.setEmail(teacher.getEmail());
        return teacherDTO;
    }
    public Teacher toTeacher(TeacherDTO teacherDTO) {
        Teacher teacher=new Teacher();
        teacher.setTeacherID(teacherDTO.getTeacherID());
        teacher.setName(teacherDTO.getName());
        teacher.setUsername(teacherDTO.getUsername());
        teacher.setPassword(teacherDTO.getPassword());
        teacher.setEmail(teacherDTO.getEmail());
        return teacher;
    }

    public List<TeacherDTO> toTeacherDTO(List<Teacher> teachers) {
        List<TeacherDTO> teacherDTOS=new ArrayList<>();
        for (Teacher teacher : teachers) {
            TeacherDTO teacherDTO= toTeacherDTO(teacher);
            teacherDTOS.add(teacherDTO);

        }
        return teacherDTOS;
    }

    public ClassroomDTO  toClassroomDTO(Classroom classroom) {
        ClassroomDTO classroomDTO=new ClassroomDTO();
        classroomDTO.setClassroomID(classroom.getClassroomID());
        classroomDTO.setName(classroom.getName());
        classroomDTO.setDescription(classroom.getDescription());
        return classroomDTO;
    }

    public Classroom toClassroom(ClassroomDTO classroomDTO) {
        Classroom classroom=new Classroom();
        classroom.setClassroomID(classroomDTO.getClassroomID());
        classroom.setName(classroomDTO.getName());
        classroom.setDescription(classroomDTO.getDescription());
        return classroom;
    }

    public StudentDTO  toStudentDTO(Student student) {
        StudentDTO studentDTO=new StudentDTO();
        studentDTO.setStudentID(student.getStudentID());
        studentDTO.setName(student.getName());
        studentDTO.setUsername(student.getUsername());
        studentDTO.setEmail(student.getEmail());
        studentDTO.setPassword(student.getPassword());
        return studentDTO;
    }

    public Student toStudent(StudentDTO studentDTO) {
        Student student=new Student();
        student.setStudentID(studentDTO.getStudentID());
        student.setName(studentDTO.getName());
        student.setEmail(studentDTO.getEmail());
        student.setPassword(studentDTO.getPassword());
        student.setUsername(studentDTO.getUsername());
        return student;
    }


    public ARExperienceDTO  toARExperienceDTO(ARExperience arExperience) {
        ARExperienceDTO arExperienceDTO=new ARExperienceDTO();
        arExperienceDTO.setExperienceID(arExperience.getExperienceID());
        arExperienceDTO.setName(arExperience.getName());
        arExperienceDTO.setDescription(arExperience.getDescription());
        arExperienceDTO.setFile(arExperience.getFile());
        return arExperienceDTO;
    }

    public ARExperience toARExperience(ARExperienceDTO arExperienceDTO) {
        ARExperience arExperience=new ARExperience();

        arExperience.setExperienceID(arExperienceDTO.getExperienceID());
        arExperience.setName(arExperienceDTO.getName());
        arExperience.setDescription(arExperienceDTO.getDescription());
        arExperience.setFile(arExperienceDTO.getFile());
        return arExperience;
    }

    public ARExperienceDTO toARExperienceDTO(ARExperience arExperience) {
        ARExperienceDTO arExperienceDTO = new ARExperienceDTO();
        arExperienceDTO.setExperienceID(arExperience.getExperienceID());
        arExperienceDTO.setName(arExperience.getName());
        arExperienceDTO.setDescription(arExperience.getDescription());
        arExperienceDTO.setFile(arExperience.getFile());
        return arExperienceDTO;
    }

        public List<ClassroomDTO>  toClassroomDTO(List<Classroom> classrooms) {

        List<ClassroomDTO> classroomDTOS=new ArrayList<>();
        for (Classroom classroom : classrooms) {
            ClassroomDTO classroomDTO=toClassroomDTO(classroom);
            classroomDTOS.add(classroomDTO);
        }
        return classroomDTOS;
    }

    public List<Classroom> toClassroom(List<ClassroomDTO> classroomDTOS) {
        List<Classroom> classrooms=new ArrayList<>();
        for (ClassroomDTO classroomDTO : classroomDTOS) {
            Classroom classroom = toClassroom(classroomDTO);
            classrooms.add(classroom);
        }
        return classrooms;
    }

    public List<StudentDTO>  toStudentDTO(List<Student> students) {
        List<StudentDTO> studentDTOS=new ArrayList<>();
        for (Student student : students) {
            StudentDTO studentDTO=toStudentDTO(student);
            studentDTOS.add(studentDTO);
        }
        return studentDTOS;
    }

    public List<Student> toStudent(List<StudentDTO> studentDTOS) {
        List<Student> students=new ArrayList<>();
        for (StudentDTO studentDTO : studentDTOS) {
            Student student=toStudent(studentDTO);
            students.add(student);
        }
        return students;
    }

    public List<ARExperienceDTO>   toARExperienceDTO(List<ARExperience> arExperiences) {
        List<ARExperienceDTO> arExperienceDTOS=new ArrayList<>();
        for (ARExperience arExperience : arExperiences) {
            ARExperienceDTO arExperienceDTO=toARExperienceDTO(arExperience);
            arExperienceDTOS.add(arExperienceDTO);
        }
        return arExperienceDTOS;
    }

    public List<ARExperience>  toARExperience(List<ARExperienceDTO> arExperienceDTOS) {
        List<ARExperience> arExperiences=new ArrayList<>();
        for (ARExperienceDTO arExperienceDTO : arExperienceDTOS) {
            ARExperience arExperience=toARExperience(arExperienceDTO);
            arExperiences.add(arExperience);
        }
        return arExperiences;
    }
}
