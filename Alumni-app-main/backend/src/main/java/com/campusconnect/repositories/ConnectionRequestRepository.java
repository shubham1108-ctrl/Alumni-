package com.campusconnect.repositories;

import com.campusconnect.models.ConnectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {
    Optional<ConnectionRequest> findByFromUserIdAndToUserId(Long fromUserId, Long toUserId);
    List<ConnectionRequest> findByFromUserId(Long fromUserId);
}
