package com.campushub;

import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FileController {
    private static final Path UPLOAD_DIR = Paths.get("uploads").toAbsolutePath().normalize();
    private static final Set<String> ALLOWED =
            Set.of("pdf", "doc", "docx", "ppt", "pptx", "txt", "png", "jpg", "jpeg", "zip");

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");

        String original = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), ""));
        int dot = original.lastIndexOf('.');
        String ext = dot >= 0 ? original.substring(dot + 1).toLowerCase() : "";
        if (!ALLOWED.contains(ext))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File type not allowed: ." + ext);

        Files.createDirectories(UPLOAD_DIR);
        String storedName = UUID.randomUUID() + "." + ext;
        Files.copy(file.getInputStream(), UPLOAD_DIR.resolve(storedName), StandardCopyOption.REPLACE_EXISTING);

        Map<String, String> result = new LinkedHashMap<>();
        result.put("fileName", original);
        result.put("fileUrl", "http://localhost:8080/files/" + storedName);
        return result;
    }
}