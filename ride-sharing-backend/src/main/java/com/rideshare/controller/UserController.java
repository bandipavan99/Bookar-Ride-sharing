package com.rideshare.controller;

import com.rideshare.dto.request.UpdateProfileRequest;
import com.rideshare.dto.response.ApiResponse;
import com.rideshare.dto.response.RideDto;
import com.rideshare.dto.response.UserDto;
import com.rideshare.entity.User;
import com.rideshare.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(userService.getProfile(user)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest request) {
        UserDto updated = userService.updateProfile(user, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/rides")
    public ResponseEntity<ApiResponse<List<RideDto>>> getRideHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(userService.getRideHistory(user)));
    }
}
