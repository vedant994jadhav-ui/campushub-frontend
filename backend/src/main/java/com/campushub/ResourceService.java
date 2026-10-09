package com.campushub;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResourceService {
    private final ResourceRepository repo;

    public ResourceService(ResourceRepository repo) { this.repo = repo; }

    public List<Resource> getAll(String type, String search) {
        if (search != null && !search.isBlank()) return repo.findByTitleContainingIgnoreCase(search);
        if (type != null && !type.isBlank()) return repo.findByType(type);
        return repo.findAll();
    }

    public Resource getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public Resource create(Resource r) { return repo.save(r); }

    public Resource update(Long id, Resource data) {
        Resource r = getById(id);
        r.setTitle(data.getTitle());
        r.setType(data.getType());
        r.setDescription(data.getDescription());
        r.setFileUrl(data.getFileUrl());
        return repo.save(r);
    }

    public void delete(Long id) {
        repo.delete(getById(id));
    }
}