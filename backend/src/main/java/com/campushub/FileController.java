package com.campushub;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/files")
public class FileController {
    private static final Set<String> ALLOWED =
            Set.of("pdf", "doc", "docx", "ppt", "pptx", "txt", "png", "jpg", "jpeg", "zip");

    private final StoredFileRepository repo;

    @Value("${app.base-url}")
    private String baseUrl;

    public FileController(StoredFileRepository repo) { this.repo = repo; }

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");

        String original = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), "file"));
        int dot = original.lastIndexOf('.');
        String ext = dot >= 0 ? original.substring(dot + 1).toLowerCase() : "";
        if (!ALLOWED.contains(ext))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File type not allowed: ." + ext);

        StoredFile f = new StoredFile();
        f.setFileName(original);
        f.setContentType(file.getContentType());
        f.setData(file.getBytes());
        StoredFile saved = repo.save(f);

        Map<String, String> result = new LinkedHashMap<>();
        result.put("fileName", original);
        result.put("fileUrl", baseUrl + "/api/files/" + saved.getId());
        return result;
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        StoredFile f = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));
        MediaType type;
        try {
            type = MediaType.parseMediaType(f.getContentType());
        } catch (Exception e) {
            type = MediaType.APPLICATION_OCTET_STREAM;
        }
        return ResponseEntity.ok()
                .contentType(type)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename(f.getFileName(), StandardCharsets.UTF_8).build().toString())
                .body(f.getData());
    }
}