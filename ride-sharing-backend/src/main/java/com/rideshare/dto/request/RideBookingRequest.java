package com.rideshare.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RideBookingRequest {
    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;

    @NotBlank(message = "Drop location is required")
    private String dropLocation;

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType; // BIKE, CAR, AUTO

    private String paymentMethod; // CASH, CARD, UPI, WALLET
}
