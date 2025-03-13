package com.example.backend.controller;


import com.example.backend.DTOS.ClassroomDTO;
import com.example.backend.DTOS.StudentDTO;
import com.example.backend.DTOS.TeacherDTO;
import com.example.backend.service.AppService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping("/students")
public class StudentController {
    private AppService appService;

    @PostMapping()
    public StudentDTO saveTeacher(@RequestBody StudentDTO studentDTO) {

        return appService.saveStudent(studentDTO);
    }

    @GetMapping("/{studentID}")
    public StudentDTO getStudentById(@PathVariable Long studentID) {
        return appService.getStudentById(studentID);
    }

    @PostMapping("/{studentID}/{classroomID}")
        public ClassroomDTO updateStudent(@PathVariable Long studentID, @PathVariable Long classroomID) {
        return appService.addStudentInClassroom(classroomID, studentID);

    }

    @PutMapping("/{studentID}")
    public StudentDTO updateStudent(@PathVariable Long studentID, @RequestBody StudentDTO studentDTO) {
        studentDTO.setStudentID(studentID);
        return appService.updateStudent(studentDTO);


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
