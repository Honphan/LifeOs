package com.example.demo.common.service;

import com.example.demo.common.dto.UploadResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@Service
public class UploadService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private final CloudinaryStorageService cloudinaryStorageService;

    public UploadService(CloudinaryStorageService cloudinaryStorageService) {
        this.cloudinaryStorageService = cloudinaryStorageService;
    }

    public UploadResponse uploadImage(MultipartFile file) {
        validateFile(file);

        String publicId = UUID.randomUUID().toString();
        try {
            var uploaded = cloudinaryStorageService.uploadImage(file, publicId);
            return new UploadResponse(
                    uploaded.url(),
                    uploaded.publicId(),
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : publicId,
                    file.getContentType(),
                    file.getSize());
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể tải ảnh lên Cloudinary", ex);
        }
    }

    public void delete(String publicId) {
        try {
            cloudinaryStorageService.delete(publicId);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể xóa ảnh trên Cloudinary", ex);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File không hợp lệ");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File vượt quá 5MB");
        }
        if (file.getContentType() == null || !ALLOWED_TYPES.contains(file.getContentType().toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ chấp nhận jpg, png, webp");
        }
    }
}