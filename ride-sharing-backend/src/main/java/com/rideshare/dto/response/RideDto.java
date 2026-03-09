package com.rideshare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RideDto {
    private Long rideId;
    private Long userId;
    private String userName;
    private Long driverId;
    private String driverName;
    private String vehicleType;
    private String vehicleNumber;
    private String pickupLocation;
    private String dropLocation;
    private String rideStatus;
    private Double fare;
    private Double distanceKm;
    private String rideTime;
    private String completedAt;
    private String paymentMethod;
    private String paymentStatus;
}
