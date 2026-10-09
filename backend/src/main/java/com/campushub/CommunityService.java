package com.campushub;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CommunityService {
    private final StudentGroupRepository groups;
    private final PostRepository posts;
    private final GroupMemberRepository members;
    private final UserRepository users;

    public CommunityService(StudentGroupRepository groups, PostRepository posts,
                            GroupMemberRepository members, UserRepository users) {
        this.groups = groups;
        this.posts = posts;
        this.members = members;
        this.users = users;
    }

    private ResponseStatusException notFound(String msg) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, msg);
    }

    private void checkUser(Long userId) {
        if (!users.existsById(userId)) throw notFound("User not found with id " + userId);
    }

    private StudentGroup findGroup(Long id) {
        return groups.findById(id).orElseThrow(() -> notFound("Group not found with id " + id));
    }

    // ---------- Groups ----------
    @Transactional
    public StudentGroup createGroup(StudentGroup g) {
        checkUser(g.getCreatedBy());
        StudentGroup saved = groups.save(g);
        GroupMember m = new GroupMember();
        m.setGroupId(saved.getId());
        m.setUserId(g.getCreatedBy());
        m.setStatus("APPROVED"); // creator apoaap member
        members.save(m);
        return saved;
    }

    public List<StudentGroup> getGroups(String search) {
        if (search != null && !search.isBlank()) return groups.findByGroupNameContainingIgnoreCase(search);
        return groups.findAll();
    }

    public StudentGroup getGroup(Long id) { return findGroup(id); }

    public StudentGroup updateGroup(Long id, StudentGroup data) {
        StudentGroup g = findGroup(id);
        if (data.getGroupName() == null || data.getGroupName().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Group name is required");
        g.setGroupName(data.getGroupName());
        g.setDescription(data.getDescription());
        return groups.save(g);
    }

    @Transactional
    public void deleteGroup(Long id) {
        StudentGroup g = findGroup(id);
        posts.deleteByGroupId(id);   // adhi posts
        members.deleteByGroupId(id); // mag members
        groups.delete(g);            // shevti group
    }

    // ---------- Membership ----------
    public GroupMember joinRequest(Long groupId, Long userId) {
        findGroup(groupId);
        checkUser(userId);
        if (members.findByGroupIdAndUserId(groupId, userId).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Request or membership already exists");
        GroupMember m = new GroupMember();
        m.setGroupId(groupId);
        m.setUserId(userId);
        m.setStatus("PENDING");
        return members.save(m);
    }

    public List<GroupMember> pendingRequests(Long groupId) {
        findGroup(groupId);
        return members.findByGroupIdAndStatus(groupId, "PENDING");
    }

    public GroupMember updateMemberStatus(Long groupId, Long userId, String status) {
        if (!"APPROVED".equals(status) && !"REJECTED".equals(status))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be APPROVED or REJECTED");
        GroupMember m = members.findByGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> notFound("Membership request not found"));
        m.setStatus(status);
        return members.save(m);
    }

    // ---------- Posts ----------
    public Post createPost(Post p) {
        findGroup(p.getGroupId());
        checkUser(p.getUserId());
        GroupMember m = members.findByGroupIdAndUserId(p.getGroupId(), p.getUserId()).orElse(null);
        if (m == null || !"APPROVED".equals(m.getStatus()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only approved members can post");
        return posts.save(p);
    }

    public List<Post> postsByGroup(Long groupId) {
        findGroup(groupId);
        return posts.findByGroupIdOrderByCreatedAtDesc(groupId);
    }

    public Post updatePost(Long id, Post data) {
        Post p = posts.findById(id).orElseThrow(() -> notFound("Post not found with id " + id));
        if (data.getContent() == null || data.getContent().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content is required");
        p.setContent(data.getContent());
        return posts.save(p);
    }

    public void deletePost(Long id) {
        Post p = posts.findById(id).orElseThrow(() -> notFound("Post not found with id " + id));
        posts.delete(p);
    }
}