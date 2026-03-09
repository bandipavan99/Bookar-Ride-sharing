package com.rideshare.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DriverRegistrationRequest {
    @NotBlank(message = "Vehicle type is required")
    private String vehicleType; // BIKE, CAR, AUTO

    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;
}
