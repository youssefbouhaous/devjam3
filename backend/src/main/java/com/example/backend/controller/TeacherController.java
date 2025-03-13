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
    public ClassroomDTO createClassroom(@RequestBody ClassroomDTO classroomDTO, @PathVariable @RequestParam Long teacherId) {
        return appService.addClassroom(classroomDTO, teacherId);
    }

    @GetMapping("/{teacherId}")
    public TeacherDTO getTeacher(@PathVariable Long teacherId) {
        return appService.getTeacherById(teacherId);
    }

    @GetMapping("/{teacherId}/classrooms")
    public List<ClassroomDTO> getClassrooms(@PathVariable Long teacherId) {
        return appService.getAllClassroomsByTeacherId(teacherId);

    }




    /*@PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Teacher t) {
        String email = t.getEmail();
        String password = t.getPassword();
        log.info("Attempting login with email: {}", email);

        Teacher teacher = appService.getTeacherByEmail(email);

        if (teacher == null) {
            log.warn("No teacher found with email: {}", email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        log.info("Teacher found: {}", teacher.getEmail());
        log.info("Stored password: {}", teacher.getPassword());
        log.info("Provided password: {}", password);

        if (!teacher.getPassword().equals(password)) {
            log.warn("Incorrect password for email: {}", email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        String token = generateToken(teacher);
        return ResponseEntity.ok(Map.of("token", token, "user", teacher));
    }


    private String generateToken(Teacher teacher) {
        // Implement token generation logic here
        return "dummy-token";
    }

    @PutMapping("/teachers/{techerId}")
    public Teacher updateTeacher(@RequestBody Teacher teacher, @PathVariable Long techerId) {
        teacher.setTeacherID(techerId);
        return appService.saveTeacher(teacher);

    }*/
}
