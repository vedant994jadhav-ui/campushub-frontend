package com.campushub;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import org.springframework.data.domain.Sort;

@Service
public class EngagementService {
    private final NotificationRepository notifications;
    private final UserRepository users;

    public EngagementService(NotificationRepository notifications,
                             UserRepository users) {
        this.notifications = notifications;
        this.users = users;
    }

    private void checkUser(Long userId) {
        if (!users.existsById(userId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id " + userId);
    }

    public Notification createNotification(Notification n) {
        checkUser(n.getUserId());
        return notifications.save(n);
    }

   public List<Notification> notificationsFor(Long userId) {
    checkUser(userId);
    return notifications.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
}
    public Notification markRead(Long id) {
        Notification n = notifications.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found with id " + id));
        n.setStatus("READ");
        return notifications.save(n);
    }

   
}
