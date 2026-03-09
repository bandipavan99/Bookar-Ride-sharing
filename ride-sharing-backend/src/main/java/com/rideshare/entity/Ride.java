package com.rideshare.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ride_id")
    private Long rideId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(name = "pickup_location", nullable = false, length = 255)
    private String pickupLocation;

    @Column(name = "drop_location", nullable = false, length = 255)
    private String dropLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private Driver.VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "ride_status", nullable = false)
    @Builder.Default
    private RideStatus rideStatus = RideStatus.REQUESTED;

    @Column(precision = 10, scale = 2)
    private BigDecimal fare;

    @Column(name = "distance_km", precision = 6, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "ride_time")
    private LocalDateTime rideTime;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        rideTime = LocalDateTime.now();
    }

    public enum RideStatus {
        REQUESTED, ACCEPTED, ONGOING, COMPLETED, CANCELLED
    }
}
