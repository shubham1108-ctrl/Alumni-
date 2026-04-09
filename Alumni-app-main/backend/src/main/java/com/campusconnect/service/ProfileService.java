package com.campusconnect.service;

import com.campusconnect.dto.ProfileDto;
import com.campusconnect.models.User;
import com.campusconnect.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String email, ProfileDto profileDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (profileDto.getFullName() != null) {
            user.setFullName(profileDto.getFullName());
        }
        if (profileDto.getTitle() != null) {
            user.setTitle(profileDto.getTitle());
        }
        if (profileDto.getBio() != null) {
            user.setBio(profileDto.getBio());
        }
        if (profileDto.getSkills() != null) {
            user.setSkills(profileDto.getSkills());
        }
        if (profileDto.getExperience() != null) {
            user.setExperience(profileDto.getExperience());
        }
        if (profileDto.getJobTitle() != null) {
            user.setJobTitle(profileDto.getJobTitle());
        }
        if (profileDto.getCompanyName() != null) {
            user.setCompanyName(profileDto.getCompanyName());
        }
        if (profileDto.getCurrentlyWorking() != null) {
            user.setCurrentlyWorking(profileDto.getCurrentlyWorking());
        }

        return userRepository.save(user);
    }
}
