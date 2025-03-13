package com.example.backend.controller;


import com.example.backend.DTOS.ARExperienceDTO;
import com.example.backend.service.AppService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping("/{classroomId}/experiences")
public class ARExperienceController {
    private AppService appService;
    @PutMapping("/{arExperienceId}")
    public ARExperienceDTO updateARExperience(@PathVariable Long arExperienceId, @RequestBody ARExperienceDTO arExperienceDTO) {
        arExperienceDTO.setExperienceID(arExperienceId);
        return appService.updateARExperience(arExperienceDTO);
    }


}
