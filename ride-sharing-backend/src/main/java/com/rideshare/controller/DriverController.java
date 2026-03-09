package com.rideshare.controller;

import com.rideshare.dto.request.DriverRegistrationRequest;
import com.rideshare.dto.response.ApiResponse;
import com.rideshare.dto.response.DriverDto;
import com.rideshare.dto.response.RideDto;
import com.rideshare.entity.User;
import com.rideshare.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<DriverDto>> registerDriver(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DriverRegistrationRequest request) {
        DriverDto dto = driverService.registerDriver(user, request);
        return ResponseEntity.ok(ApiResponse.success("Driver registered successfully", dto));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<DriverDto>> getDriverProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getDriverProfile(user)));
    }

    @PutMapping("/availability")
    public ResponseEntity<ApiResponse<DriverDto>> updateAvailability(
            @AuthenticationPrincipal User user,
            @RequestParam boolean status) {
        DriverDto dto = driverService.updateAvailability(user, status);
        return ResponseEntity.ok(ApiResponse.success("Availability updated", dto));
    }

    @GetMapping("/rides")
    public ResponseEntity<ApiResponse<List<RideDto>>> getDriverRides(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getDriverRides(user)));
    }

    @GetMapping("/earnings")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEarnings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getEarnings(user)));
    }

    @PutMapping("/respond/{rideId}")
    public ResponseEntity<ApiResponse<RideDto>> respondToRide(
            @AuthenticationPrincipal User user,
            @PathVariable Long rideId,
            @RequestParam boolean accept) {
        RideDto dto = driverService.respondToRide(user, rideId, accept);
        return ResponseEntity.ok(ApiResponse.success(accept ? "Ride accepted" : "Ride rejected", dto));
    }
}
