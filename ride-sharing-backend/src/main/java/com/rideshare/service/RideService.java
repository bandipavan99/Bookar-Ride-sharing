package com.rideshare.service;

import com.rideshare.dto.request.RideBookingRequest;
import com.rideshare.dto.response.RideDto;
import com.rideshare.entity.*;
import com.rideshare.exception.BadRequestException;
import com.rideshare.exception.ResourceNotFoundException;
import com.rideshare.repository.DriverRepository;
import com.rideshare.repository.PaymentRepository;
import com.rideshare.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final DriverRepository driverRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public RideDto bookRide(User user, RideBookingRequest request) {
        Driver.VehicleType vehicleType;
        try {
            vehicleType = Driver.VehicleType.valueOf(request.getVehicleType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid vehicle type: " + request.getVehicleType());
        }

        // Calculate fare (simulate distance-based)
        double distanceKm = 2.0 + new Random().nextDouble() * 13; // 2-15 km
        distanceKm = Math.round(distanceKm * 10.0) / 10.0;
        BigDecimal fare = calculateFare(vehicleType, distanceKm);

        // Find available driver
        List<Driver> availableDrivers = driverRepository
                .findByVehicleTypeAndAvailabilityStatusTrue(vehicleType);

        Driver assignedDriver = null;
        if (!availableDrivers.isEmpty()) {
            assignedDriver = availableDrivers.get(new Random().nextInt(availableDrivers.size()));
        }

        Ride ride = Ride.builder()
                .user(user)
                .driver(assignedDriver)
                .pickupLocation(request.getPickupLocation())
                .dropLocation(request.getDropLocation())
                .vehicleType(vehicleType)
                .rideStatus(assignedDriver != null ? Ride.RideStatus.ACCEPTED : Ride.RideStatus.REQUESTED)
                .fare(fare)
                .distanceKm(BigDecimal.valueOf(distanceKm))
                .build();

        ride = rideRepository.save(ride);

        // Create payment record
        Payment.PaymentMethod paymentMethod = Payment.PaymentMethod.CASH;
        if (request.getPaymentMethod() != null) {
            try {
                paymentMethod = Payment.PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
            } catch (IllegalArgumentException ignored) {
            }
        }

        Payment payment = Payment.builder()
                .ride(ride)
                .paymentMethod(paymentMethod)
                .paymentStatus(Payment.PaymentStatus.PENDING)
                .amount(fare)
                .build();
        paymentRepository.save(payment);

        return mapToDto(ride);
    }

    @Transactional(readOnly = true)
    public RideDto getRideById(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found: " + rideId));
        return mapToDto(ride);
    }

    @Transactional
    public RideDto updateRideStatus(Long rideId, String status, User currentUser) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found: " + rideId));

        Ride.RideStatus newStatus;
        try {
            newStatus = Ride.RideStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }

        ride.setRideStatus(newStatus);

        if (newStatus == Ride.RideStatus.COMPLETED) {
            ride.setCompletedAt(LocalDateTime.now());

            // Save ride first so payment lookup by rideId works correctly
            ride = rideRepository.saveAndFlush(ride);

            // Update payment using rideId-based query to avoid entity proxy issues
            Optional<Payment> paymentOpt = paymentRepository.findByRide_RideId(rideId);
            paymentOpt.ifPresent(payment -> {
                payment.setPaymentStatus(Payment.PaymentStatus.COMPLETED);
                payment.setPaidAt(LocalDateTime.now());
                paymentRepository.save(payment);
            });

            // Update driver stats — re-fetch from DB to avoid stale proxy state
            if (ride.getDriver() != null) {
                Long driverId = ride.getDriver().getDriverId();
                Driver driver = driverRepository.findById(driverId)
                        .orElse(ride.getDriver());

                Integer currentRides = driver.getTotalRides() != null ? driver.getTotalRides() : 0;
                driver.setTotalRides(currentRides + 1);

                BigDecimal currentEarnings = driver.getTotalEarnings() != null ? driver.getTotalEarnings()
                        : BigDecimal.ZERO;
                BigDecimal fareToAdd = ride.getFare() != null ? ride.getFare() : BigDecimal.ZERO;
                driver.setTotalEarnings(currentEarnings.add(fareToAdd));

                driverRepository.save(driver);
            }

            return mapToDto(ride);
        }

        rideRepository.save(ride);
        return mapToDto(ride);
    }

    @Transactional(readOnly = true)
    public List<RideDto> getAllRides() {
        return rideRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private BigDecimal calculateFare(Driver.VehicleType vehicleType, double distanceKm) {
        double baseFare;
        double perKmRate;
        switch (vehicleType) {
            case BIKE -> {
                baseFare = 20;
                perKmRate = 8;
            }
            case AUTO -> {
                baseFare = 30;
                perKmRate = 12;
            }
            case CAR -> {
                baseFare = 50;
                perKmRate = 18;
            }
            default -> {
                baseFare = 30;
                perKmRate = 10;
            }
        }
        double total = baseFare + (perKmRate * distanceKm);
        return BigDecimal.valueOf(total).setScale(2, RoundingMode.HALF_UP);
    }

    public RideDto mapToDto(Ride ride) {
        Optional<Payment> payment = paymentRepository.findByRide(ride);

        return RideDto.builder()
                .rideId(ride.getRideId())
                .userId(ride.getUser().getId())
                .userName(ride.getUser().getName())
                .driverId(ride.getDriver() != null ? ride.getDriver().getDriverId() : null)
                .driverName(ride.getDriver() != null ? ride.getDriver().getUser().getName() : null)
                .vehicleType(ride.getVehicleType().name())
                .vehicleNumber(ride.getDriver() != null ? ride.getDriver().getVehicleNumber() : null)
                .pickupLocation(ride.getPickupLocation())
                .dropLocation(ride.getDropLocation())
                .rideStatus(ride.getRideStatus().name())
                .fare(ride.getFare() != null ? ride.getFare().doubleValue() : null)
                .distanceKm(ride.getDistanceKm() != null ? ride.getDistanceKm().doubleValue() : null)
                .rideTime(ride.getRideTime() != null ? ride.getRideTime().toString() : null)
                .completedAt(ride.getCompletedAt() != null ? ride.getCompletedAt().toString() : null)
                .paymentMethod(payment.map(p -> p.getPaymentMethod().name()).orElse(null))
                .paymentStatus(payment.map(p -> p.getPaymentStatus().name()).orElse(null))
                .build();
    }
}
