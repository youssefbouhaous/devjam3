package com.example.backend.controller;


import com.example.backend.DTOS.ARExperienceDTO;
import com.example.backend.DTOS.ClassroomDTO;
import com.example.backend.DTOS.TeacherDTO;
import com.example.backend.entities.Classroom;
import com.example.backend.service.AppService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping("teachers/{teacherID}/classrooms")
public class ClassroomController {
    private AppService appService;



    @PostMapping("/{classroomId}")
    public ARExperienceDTO createARExperience(@PathVariable Long teacherID,@RequestBody ARExperienceDTO arExperienceDTO, @PathVariable Long classroomId) {
        return  appService.addARExperience(arExperienceDTO, classroomId);
    }



    /*@PostMapping("/classrooms")
    public Classroom addClassroom(@RequestParam String name,
                                  @RequestParam String description,
                                  @RequestParam Long teacherId) {
        Classroom classroom = appService.addClassroom(name, description, teacherId);
        return  classroom;
    }*/

}
