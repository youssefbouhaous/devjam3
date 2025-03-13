package com.example.backend.controller;

import com.example.backend.DTOS.ARExperienceDTO;
import com.example.backend.entities.ARExperience;
import com.example.backend.service.AppService;
import com.example.backend.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin(origins = "*")
@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping("/{classroomId}/experiences")
public class ARExperienceController {
    private AppService appService;
    private FileStorageService fileStorageService;

    @PutMapping("/{arExperienceId}")
    public ARExperienceDTO updateARExperience(@PathVariable Long arExperienceId, @RequestBody ARExperienceDTO arExperienceDTO) {
        arExperienceDTO.setExperienceID(arExperienceId);
        return appService.updateARExperience(arExperienceDTO);
    }

    @PostMapping("/{arExperienceId}/upload")
    public ResponseEntity<String> uploadFile(
            @PathVariable Long arExperienceId,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty.");
        }

        // Validate file type (.glb or .obj)
        String fileName = file.getOriginalFilename();
        if (fileName != null && !fileName.toLowerCase().endsWith(".glb") && !fileName.toLowerCase().endsWith(".obj")) {
            return ResponseEntity.badRequest().body("Only .glb and .obj files are allowed.");
        }

        // Store the file
        String storedFileName = fileStorageService.storeFile(file);

        // Update the ARExperience entity with the file name
        appService.updateARExperienceFile(arExperienceId, storedFileName);

        return ResponseEntity.ok().body(storedFileName);
    }

    @GetMapping("/{arExperienceId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long arExperienceId, HttpServletRequest request) {
        // Get the ARExperience entity
        ARExperience arExperience = appService.getARExperienceById(arExperienceId);

        // Load the file as a resource
        Resource resource = fileStorageService.loadFileAsResource(arExperience.getFile());

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            log.info("Could not determine file type.");
        }

        // Default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        // For .glb files, use the correct MIME type
        if (resource.getFilename() != null && resource.getFilename().toLowerCase().endsWith(".glb")) {
            contentType = "model/gltf-binary";
        }
        // For .obj files, use the correct MIME type
        else if (resource.getFilename() != null && resource.getFilename().toLowerCase().endsWith(".obj")) {
            contentType = "application/x-tgif";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}