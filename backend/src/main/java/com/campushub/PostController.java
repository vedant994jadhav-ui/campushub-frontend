package com.campushub;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PostController {
    private final CommunityService service;

    public PostController(CommunityService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Post create(@Valid @RequestBody Post p) { return service.createPost(p); }

    @GetMapping("/group/{groupId}")
    public List<Post> byGroup(@PathVariable Long groupId) { return service.postsByGroup(groupId); }

    @PutMapping("/{id}")
    public Post update(@PathVariable Long id, @RequestBody Post p) { return service.updatePost(id, p); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.deletePost(id); }
}