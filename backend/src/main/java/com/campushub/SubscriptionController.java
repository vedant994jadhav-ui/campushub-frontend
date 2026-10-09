package com.campushub;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SubscriptionController {
    private final EngagementService service;

    public SubscriptionController(EngagementService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Subscription create(@Valid @RequestBody Subscription s) { return service.createSubscription(s); }

    @GetMapping("/user/{userId}")
    public List<Subscription> forUser(@PathVariable Long userId) { return service.subscriptionsFor(userId); }

    @PutMapping("/{id}")
    public Subscription update(@PathVariable Long id, @RequestBody Subscription s) {
        return service.updateSubscription(id, s);
    }
}