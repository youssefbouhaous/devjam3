package com.example.backend.controller;


import com.example.backend.entities.Teacher;
import com.example.backend.service.AppService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@Slf4j
public class TeatcherRestController {
    private final AppService appService;


    @GetMapping("/teacher")
    public Teacher login(@RequestBody Teacher t) {
        String email = t.getEmail();
        String password = t.getPassword();
        log.info("login");
        Teacher teacher = appService.getTeacherByEmail(email);
        if (!teacher.getPassword().equals(password)) {
            throw new RuntimeException("password incorrect");

        }
        return teacher;

    }

}
