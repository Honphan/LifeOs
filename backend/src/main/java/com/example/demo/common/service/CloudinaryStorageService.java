package com.example.demo.common.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.config.CloudinaryProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryStorageService {

    private final Cloudinary cloudinary;
    private final String folder;

    public CloudinaryStorageService(
            Cloudinary cloudinary,
            CloudinaryProperties properties) {
        this.cloudinary = cloudinary;
        this.folder = properties.getFolder();
    }

    public CloudinaryUploadResult uploadImage(MultipartFile file, String publicId) throws IOException {
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", folder,
                "public_id", publicId,
                "resource_type", "image",
                "overwrite", true,
                "use_filename", false,
                "unique_filename", false);
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), options);
        return new CloudinaryUploadResult((String) result.get("secure_url"), (String) result.get("public_id"));
    }

    public void delete(String publicId) throws IOException {
        if (publicId == null || publicId.isBlank()) {
            return;
        }
        cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
    }

    public record CloudinaryUploadResult(String url, String publicId) {}
}