package com.rideshare.dto.request;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String phone;
    private String currentPassword;
    private String newPassword;
}
