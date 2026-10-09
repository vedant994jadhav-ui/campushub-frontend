package com.campushub;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class EngagementService {
    private final NotificationRepository notifications;
    private final SubscriptionRepository subscriptions;
    private final UserRepository users;

    public EngagementService(NotificationRepository notifications,
                             SubscriptionRepository subscriptions,
                             UserRepository users) {
        this.notifications = notifications;
        this.subscriptions = subscriptions;
        this.users = users;
    }

    private void checkUser(Long userId) {
        if (!users.existsById(userId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id " + userId);
    }

    // ---------- Notifications ----------
    public Notification createNotification(Notification n) {
        checkUser(n.getUserId());
        n.setId(null);
        return notifications.save(n);
    }

    public List<Notification> notificationsFor(Long userId) {
        checkUser(userId);
        return notifications.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification markRead(Long id) {
        Notification n = notifications.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found with id " + id));
        n.setStatus("READ");
        return notifications.save(n);
    }

    // ---------- Subscriptions ----------
    public Subscription createSubscription(Subscription s) {
        checkUser(s.getUserId());
        s.setId(null);
        return subscriptions.save(s);
    }

    public List<Subscription> subscriptionsFor(Long userId) {
        checkUser(userId);
        return subscriptions.findByUserId(userId);
    }

    public Subscription updateSubscription(Long id, Subscription data) {
        Subscription s = subscriptions.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription not found with id " + id));
        if (data.getPlan() == null || data.getPlan().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Plan is required");
        s.setPlan(data.getPlan());
        if (data.getStatus() != null && !data.getStatus().isBlank()) s.setStatus(data.getStatus());
        return subscriptions.save(s);
    }
}