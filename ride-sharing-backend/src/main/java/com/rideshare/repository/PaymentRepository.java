package com.rideshare.repository;

import com.rideshare.entity.Payment;
import com.rideshare.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRide(Ride ride);

    Optional<Payment> findByRide_RideId(Long rideId);
}
