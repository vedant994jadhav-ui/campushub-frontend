package com.campushub;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByGroupIdOrderByCreatedAtDesc(Long groupId);
    void deleteByGroupId(Long groupId);
}