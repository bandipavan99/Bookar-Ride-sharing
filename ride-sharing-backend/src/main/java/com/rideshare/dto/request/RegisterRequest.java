package com.rideshare.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Pattern(regexp = "^$|^[6-9]\\d{9}$", message = "Phone must be a valid 10-digit Indian number (or leave blank)")
    private String phone;

    private String role; // USER or DRIVER
}
