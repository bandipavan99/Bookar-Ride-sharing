package com.rideshare.controller;

import com.rideshare.dto.request.RideBookingRequest;
import com.rideshare.dto.response.ApiResponse;
import com.rideshare.dto.response.RideDto;
import com.rideshare.entity.User;
import com.rideshare.service.RideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<RideDto>> bookRide(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody RideBookingRequest request) {
        RideDto dto = rideService.bookRide(user, request);
        return ResponseEntity.ok(ApiResponse.success("Ride booked successfully", dto));
    }

    @GetMapping("/{rideId}")
    public ResponseEntity<ApiResponse<RideDto>> getRide(@PathVariable Long rideId) {
        return ResponseEntity.ok(ApiResponse.success(rideService.getRideById(rideId)));
    }

    @PutMapping("/{rideId}/status")
    public ResponseEntity<ApiResponse<RideDto>> updateStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long rideId,
            @RequestParam String status) {
        try {
            RideDto dto = rideService.updateRideStatus(rideId, status, user);
            return ResponseEntity.ok(ApiResponse.success("Ride status updated", dto));
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<RideDto>>> getAllRides() {
        return ResponseEntity.ok(ApiResponse.success(rideService.getAllRides()));
    }
}
