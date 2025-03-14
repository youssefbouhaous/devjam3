package com.example.backend.controller;


import com.example.backend.DTOS.ClassroomDTO;
import com.example.backend.DTOS.TeacherDTO;
import com.example.backend.entities.Teacher;
import com.example.backend.repositories.TeacherRepository;
import com.example.backend.service.AppService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping("/teachers")
public class TeacherController {
    private final TeacherRepository teacherRepository;
    private AppService appService;

    @PostMapping()
    public TeacherDTO saveTeacher(@RequestBody TeacherDTO teacherDTO) {
        return appService.saveTeacher(teacherDTO);
    }

    @PostMapping("/{teacherId}")
    public ClassroomDTO createClassroom(@RequestBody ClassroomDTO classroomDTO, @PathVariable Long teacherId) {
        log.debug("REST request to save Classroom : {}", classroomDTO);
        ClassroomDTO classroomDTO1 = appService.addClassroom(classroomDTO, teacherId);
       return classroomDTO1;
    }

    @GetMapping("/{teacherId}")
    public TeacherDTO getTeacher(@PathVariable Long teacherId) {
        return appService.getTeacherById(teacherId);
    }

    @GetMapping("/{teacherId}/classrooms")
    public List<ClassroomDTO> getClassrooms(@PathVariable Long teacherId) {
        return appService.getAllClassroomsByTeacherId(teacherId);

    }

    @PutMapping("/{teacherId}")
    public TeacherDTO updateTeacher(@RequestBody TeacherDTO teacherDTO, @PathVariable Long teacherId) {
        teacherDTO.setTeacherID(teacherId);
        return appService.updateTeacher(teacherDTO);
    }






    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody TeacherDTO teacherDTO) {

        String email = teacherDTO.getEmail();
        String password = teacherDTO.getPassword();
        log.info("Attempting login with email: {}", email);

        TeacherDTO teacherDTO2 = appService.getTeacherByEmail(email);

        if (teacherDTO2 == null) {
            log.warn("No teacher found with email: {}", email);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");

        }


        if (!teacherDTO2.getPassword().equals(password)) {
            log.warn("Incorrect password for email: {}", email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        String token = generateToken(teacherDTO2);
        return ResponseEntity.ok(Map.of("token", token, "teacher", teacherDTO2));
    }


    private String generateToken(TeacherDTO teacherDTO) {
        // Implement token generation logic here
        return "Teacher-token";
    }

    private String generateToken(ClassroomDTO classroomDTO) {
        return "Classroom-token";
    }


}
