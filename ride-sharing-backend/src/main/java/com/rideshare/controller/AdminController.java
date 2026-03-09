package com.rideshare.controller;

import com.rideshare.dto.response.ApiResponse;
import com.rideshare.dto.response.DriverDto;
import com.rideshare.dto.response.RideDto;
import com.rideshare.dto.response.UserDto;
import com.rideshare.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers()));
    }

    @GetMapping("/drivers")
    public ResponseEntity<ApiResponse<List<DriverDto>>> getAllDrivers() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllDrivers()));
    }

    @GetMapping("/rides")
    public ResponseEntity<ApiResponse<List<RideDto>>> getAllRides() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllRides()));
    }

    @PutMapping("/users/{userId}/block")
    public ResponseEntity<ApiResponse<UserDto>> blockUser(
            @PathVariable Long userId,
            @RequestParam boolean block) {
        UserDto dto = adminService.blockUser(userId, block);
        return ResponseEntity.ok(ApiResponse.success(block ? "User blocked" : "User unblocked", dto));
    }
}
