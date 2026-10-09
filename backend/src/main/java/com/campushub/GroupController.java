package com.campushub;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GroupController {
    private final CommunityService service;

    public GroupController(CommunityService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentGroup create(@Valid @RequestBody StudentGroup g) { return service.createGroup(g); }

    @GetMapping
    public List<StudentGroup> list(@RequestParam(required = false) String search) {
        return service.getGroups(search);
    }

    @GetMapping("/{id}")
    public StudentGroup get(@PathVariable Long id) { return service.getGroup(id); }

    @PutMapping("/{id}")
    public StudentGroup update(@PathVariable Long id, @RequestBody StudentGroup g) {
        return service.updateGroup(id, g);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.deleteGroup(id); }

    // membership
    @PostMapping("/{id}/join")
    @ResponseStatus(HttpStatus.CREATED)
    public GroupMember join(@PathVariable Long id, @RequestParam Long userId) {
        return service.joinRequest(id, userId);
    }

    @GetMapping("/{id}/requests")
    public List<GroupMember> requests(@PathVariable Long id) { return service.pendingRequests(id); }

    @PutMapping("/{id}/members/{userId}")
    public GroupMember updateStatus(@PathVariable Long id, @PathVariable Long userId,
                                    @RequestParam String status) {
        return service.updateMemberStatus(id, userId, status);
    }
}