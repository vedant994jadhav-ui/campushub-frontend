package com.campushub;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class NotificationController {
    private final EngagementService service;

    public NotificationController(EngagementService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notification create(@Valid @RequestBody Notification n) { return service.createNotification(n); }

    @GetMapping("/{userId}")
    public List<Notification> forUser(@PathVariable Long userId) { return service.notificationsFor(userId); }

    @PutMapping("/{id}/read")
    public Notification read(@PathVariable Long id) { return service.markRead(id); }
}