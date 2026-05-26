package com.example.demo.common.controller;

import com.example.demo.common.dto.ApiResponse;
import com.example.demo.common.dto.UploadResponse;
import com.example.demo.common.service.UploadService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UploadResponse>> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success("Tải ảnh lên thành công", uploadService.uploadImage(file)));
    }
}