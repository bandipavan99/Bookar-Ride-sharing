package com.rideshare.service;

import com.rideshare.dto.request.DriverRegistrationRequest;
import com.rideshare.dto.response.DriverDto;
import com.rideshare.dto.response.RideDto;
import com.rideshare.entity.Driver;
import com.rideshare.entity.Ride;
import com.rideshare.entity.User;
import com.rideshare.exception.BadRequestException;
import com.rideshare.exception.ResourceNotFoundException;
import com.rideshare.exception.UnauthorizedException;
import com.rideshare.repository.DriverRepository;
import com.rideshare.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;
    private final RideRepository rideRepository;
    private final RideService rideService;

    @Transactional
    public DriverDto registerDriver(User user, DriverRegistrationRequest request) {
        if (driverRepository.existsByUser(user)) {
            throw new BadRequestException("Driver profile already exists for this user");
        }
        if (user.getRole() != User.Role.DRIVER) {
            throw new BadRequestException("User must have DRIVER role to register as driver");
        }

        Driver.VehicleType vehicleType;
        try {
            vehicleType = Driver.VehicleType.valueOf(request.getVehicleType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid vehicle type: " + request.getVehicleType());
        }

        Driver driver = Driver.builder()
                .user(user)
                .vehicleType(vehicleType)
                .vehicleNumber(request.getVehicleNumber())
                .availabilityStatus(false)
                .build();

        driver = driverRepository.save(driver);
        return mapToDto(driver);
    }

    public DriverDto getDriverProfile(User user) {
        Driver driver = driverRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));
        return mapToDto(driver);
    }

    @Transactional
    public DriverDto updateAvailability(User user, boolean status) {
        Driver driver = driverRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));
        driver.setAvailabilityStatus(status);
        driverRepository.save(driver);
        return mapToDto(driver);
    }

    public List<RideDto> getDriverRides(User user) {
        Driver driver = driverRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));
        return rideRepository.findByDriverOrderByRideTimeDesc(driver)
                .stream()
                .map(rideService::mapToDto)
                .collect(Collectors.toList());
    }

    public java.util.Map<String, Object> getEarnings(User user) {
        Driver driver = driverRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("totalEarnings",
                driver.getTotalEarnings() != null ? driver.getTotalEarnings() : java.math.BigDecimal.ZERO);
        result.put("totalRides", driver.getTotalRides() != null ? driver.getTotalRides() : 0);
        result.put("rating", driver.getRating());
        result.put("driverName", driver.getUser().getName());
        return result;
    }

    @Transactional
    public RideDto respondToRide(User user, Long rideId, boolean accept) {
        Driver driver = driverRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found: " + rideId));

        if (ride.getRideStatus() != Ride.RideStatus.REQUESTED && ride.getRideStatus() != Ride.RideStatus.ACCEPTED) {
            throw new BadRequestException("Ride is not in a state to respond to");
        }

        if (accept) {
            ride.setDriver(driver);
            ride.setRideStatus(Ride.RideStatus.ACCEPTED);
        } else {
            if (ride.getDriver() != null && ride.getDriver().getDriverId().equals(driver.getDriverId())) {
                ride.setDriver(null);
                ride.setRideStatus(Ride.RideStatus.CANCELLED);
            } else {
                throw new UnauthorizedException("You are not assigned to this ride");
            }
        }

        rideRepository.save(ride);
        return rideService.mapToDto(ride);
    }

    public List<DriverDto> getAllDrivers() {
        return driverRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public DriverDto mapToDto(Driver driver) {
        return DriverDto.builder()
                .driverId(driver.getDriverId())
                .userId(driver.getUser().getId())
                .driverName(driver.getUser().getName())
                .email(driver.getUser().getEmail())
                .phone(driver.getUser().getPhone())
                .vehicleType(driver.getVehicleType().name())
                .vehicleNumber(driver.getVehicleNumber())
                .availabilityStatus(driver.isAvailabilityStatus())
                .rating(driver.getRating())
                .totalRides(driver.getTotalRides() != null ? driver.getTotalRides() : 0)
                .totalEarnings(
                        driver.getTotalEarnings() != null ? driver.getTotalEarnings() : java.math.BigDecimal.ZERO)
                .build();
    }
}
