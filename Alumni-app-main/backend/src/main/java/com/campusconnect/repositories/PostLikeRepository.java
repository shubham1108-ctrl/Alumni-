package com.campusconnect.repositories;

import com.campusconnect.models.Post;
import com.campusconnect.models.PostLike;
import com.campusconnect.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostAndUser(Post post, User user);
    int countByPost(Post post);
    void deleteByPostAndUser(Post post, User user);
    boolean existsByPostAndUser(Post post, User user);
}
