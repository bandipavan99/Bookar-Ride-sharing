package com.rideshare.service;

import com.rideshare.dto.response.DriverDto;
import com.rideshare.dto.response.RideDto;
import com.rideshare.dto.response.UserDto;
import com.rideshare.entity.User;
import com.rideshare.exception.ResourceNotFoundException;
import com.rideshare.repository.DriverRepository;
import com.rideshare.repository.PaymentRepository;
import com.rideshare.repository.RideRepository;
import com.rideshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

        private final UserRepository userRepository;
        private final DriverRepository driverRepository;
        private final RideRepository rideRepository;
        private final PaymentRepository paymentRepository;

        public List<UserDto> getAllUsers() {
                return userRepository.findAll()
                                .stream()
                                .filter(u -> u.getRole() != User.Role.ADMIN)
                                .map(this::mapUserToDto)
                                .collect(Collectors.toList());
        }

        public List<DriverDto> getAllDrivers() {
                return driverRepository.findAll()
                                .stream()
                                .map(d -> DriverDto.builder()
                                                .driverId(d.getDriverId())
                                                .userId(d.getUser().getId())
                                                .driverName(d.getUser().getName())
                                                .email(d.getUser().getEmail())
                                                .phone(d.getUser().getPhone())
                                                .vehicleType(d.getVehicleType().name())
                                                .vehicleNumber(d.getVehicleNumber())
                                                .availabilityStatus(d.isAvailabilityStatus())
                                                .rating(d.getRating())
                                                .totalRides(d.getTotalRides())
                                                .build())
                                .collect(Collectors.toList());
        }

        public List<RideDto> getAllRides() {
                return rideRepository.findAll()
                                .stream()
                                .map(ride -> {
                                        Optional<com.rideshare.entity.Payment> payment = paymentRepository
                                                        .findByRide(ride);
                                        return RideDto.builder()
                                                        .rideId(ride.getRideId())
                                                        .userId(ride.getUser().getId())
                                                        .userName(ride.getUser().getName())
                                                        .driverId(ride.getDriver() != null
                                                                        ? ride.getDriver().getDriverId()
                                                                        : null)
                                                        .driverName(ride.getDriver() != null
                                                                        ? ride.getDriver().getUser().getName()
                                                                        : null)
                                                        .vehicleType(ride.getVehicleType().name())
                                                        .vehicleNumber(ride.getDriver() != null
                                                                        ? ride.getDriver().getVehicleNumber()
                                                                        : null)
                                                        .pickupLocation(ride.getPickupLocation())
                                                        .dropLocation(ride.getDropLocation())
                                                        .rideStatus(ride.getRideStatus().name())
                                                        .fare(ride.getFare() != null ? ride.getFare().doubleValue()
                                                                        : null)
                                                        .distanceKm(ride.getDistanceKm() != null
                                                                        ? ride.getDistanceKm().doubleValue()
                                                                        : null)
                                                        .rideTime(ride.getRideTime() != null
                                                                        ? ride.getRideTime().toString()
                                                                        : null)
                                                        .completedAt(ride.getCompletedAt() != null
                                                                        ? ride.getCompletedAt().toString()
                                                                        : null)
                                                        .paymentMethod(payment.map(p -> p.getPaymentMethod().name())
                                                                        .orElse(null))
                                                        .paymentStatus(payment.map(p -> p.getPaymentStatus().name())
                                                                        .orElse(null))
                                                        .build();
                                })
                                .collect(Collectors.toList());
        }

        @Transactional
        public UserDto blockUser(Long userId, boolean block) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                user.setBlocked(block);
                userRepository.save(user);
                return mapUserToDto(user);
        }

        public Map<String, Object> getDashboardStats() {
                Map<String, Object> stats = new HashMap<>();
                stats.put("totalUsers", userRepository.count());
                stats.put("totalDrivers", driverRepository.count());
                stats.put("totalRides", rideRepository.count());
                stats.put("activeRides", rideRepository.countByRideStatus(
                                com.rideshare.entity.Ride.RideStatus.ONGOING));
                stats.put("completedRides", rideRepository.countByRideStatus(
                                com.rideshare.entity.Ride.RideStatus.COMPLETED));
                stats.put("requestedRides", rideRepository.countByRideStatus(
                                com.rideshare.entity.Ride.RideStatus.REQUESTED));
                stats.put("availableDrivers", driverRepository.findByAvailabilityStatusTrue().size());
                return stats;
        }

        private UserDto mapUserToDto(User user) {
                return UserDto.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .phone(user.getPhone())
                                .role(user.getRole().name())
                                .blocked(user.isBlocked())
                                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                                .build();
        }
}
