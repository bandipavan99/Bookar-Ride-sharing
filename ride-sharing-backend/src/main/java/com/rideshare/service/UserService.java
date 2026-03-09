package com.rideshare.service;

import com.rideshare.dto.request.UpdateProfileRequest;
import com.rideshare.dto.response.RideDto;
import com.rideshare.dto.response.UserDto;
import com.rideshare.entity.User;
import com.rideshare.exception.BadRequestException;
import com.rideshare.exception.ResourceNotFoundException;
import com.rideshare.repository.PaymentRepository;
import com.rideshare.repository.RideRepository;
import com.rideshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getProfile(User currentUser) {
        return mapToDto(currentUser);
    }

    public UserDto updateProfile(User currentUser, UpdateProfileRequest request) {
        if (request.getName() != null && !request.getName().isBlank()) {
            currentUser.setName(request.getName());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            currentUser.setPhone(request.getPhone());
        }
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null ||
                    !passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
                throw new BadRequestException("Current password is incorrect");
            }
            currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        userRepository.save(currentUser);
        return mapToDto(currentUser);
    }

    public List<RideDto> getRideHistory(User currentUser) {
        return rideRepository.findByUserOrderByRideTimeDesc(currentUser)
                .stream()
                .map(ride -> {
                    var payment = paymentRepository.findByRide(ride);
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
                })
                .collect(Collectors.toList());
    }

    public UserDto mapToDto(User user) {
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

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
