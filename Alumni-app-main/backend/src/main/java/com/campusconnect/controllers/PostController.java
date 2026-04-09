package com.campusconnect.controllers;

import com.campusconnect.dto.PostDto.*;
import com.campusconnect.models.Comment;
import com.campusconnect.models.Post;
import com.campusconnect.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping({"", "/all"})
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PostMapping({"", "/create"})
    public ResponseEntity<?> createPost(@RequestBody CreatePostRequest request) {
        String email = getCurrentUserEmail();
        Post post = postService.createPost(request.getContent(), email);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getPostsByUser(userId));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable Long id) {
        String email = getCurrentUserEmail();
        Post post = postService.likePost(id, email);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<Comment> addComment(@PathVariable Long id, @RequestBody CommentRequest request) {
        String email = getCurrentUserEmail();
        Comment comment = postService.addComment(id, request.getContent(), email);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getComments(id));
    }

    private String getCurrentUserEmail() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }
}
