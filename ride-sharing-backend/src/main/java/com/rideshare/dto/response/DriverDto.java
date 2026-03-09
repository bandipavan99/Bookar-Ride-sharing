package com.rideshare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverDto {
    private Long driverId;
    private Long userId;
    private String driverName;
    private String email;
    private String phone;
    private String vehicleType;
    private String vehicleNumber;
    private boolean availabilityStatus;
    private Double rating;
    private Integer totalRides;
    private java.math.BigDecimal totalEarnings;
}
