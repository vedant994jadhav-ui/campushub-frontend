package com.campushub;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = {"http://localhost:5174", "http://localhost:3000"})
public class ResourceController {
    private final ResourceService service;

    public ResourceController(ResourceService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Resource create(@Valid @RequestBody Resource r) { return service.create(r); }

    @GetMapping
    public List<Resource> list(@RequestParam(required = false) String type,
                               @RequestParam(required = false) String search) {
        return service.getAll(type, search);
    }

    @GetMapping("/{id}")
    public Resource get(@PathVariable Long id) { return service.getById(id); }

    @PutMapping("/{id}")
    public Resource update(@PathVariable Long id, @Valid @RequestBody Resource r) {
        return service.update(id, r);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}