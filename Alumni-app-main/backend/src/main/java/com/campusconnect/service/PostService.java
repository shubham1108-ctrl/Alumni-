package com.campusconnect.service;

import com.campusconnect.models.*;
import com.campusconnect.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostLikeRepository postLikeRepository;

    public Post createPost(String content, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setContent(content);
        post.setAuthor(user);

        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getPostsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return postRepository.findByAuthorOrderByCreatedAtDesc(user);
    }

    @Transactional
    public Post likePost(Long postId, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (postLikeRepository.existsByPostAndUser(post, user)) {
            // Unlike: remove the like
            postLikeRepository.deleteByPostAndUser(post, user);
            post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
        } else {
            // Like: add a new like
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUser(user);
            postLikeRepository.save(like);
            post.setLikesCount(post.getLikesCount() + 1);
        }

        return postRepository.save(post);
    }

    public Comment addComment(Long postId, String content, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setAuthor(user);
        comment.setPost(post);

        return commentRepository.save(comment);
    }

    public List<Comment> getComments(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return commentRepository.findByPostOrderByCreatedAtAsc(post);
    }
}
