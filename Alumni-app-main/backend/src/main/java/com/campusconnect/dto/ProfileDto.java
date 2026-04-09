package com.campusconnect.dto;

import lombok.Data;

@Data
public class ProfileDto {
    private String fullName;
    private String title;
    private String bio;
    private String skills;
    private String experience;
    private String jobTitle;
    private String companyName;
    private Boolean currentlyWorking;
}
