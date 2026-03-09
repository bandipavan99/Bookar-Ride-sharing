package com.rideshare.repository;

import com.rideshare.entity.Ride;
import com.rideshare.entity.Driver;
import com.rideshare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByUserOrderByRideTimeDesc(User user);

    List<Ride> findByDriverOrderByRideTimeDesc(Driver driver);

    List<Ride> findByRideStatus(Ride.RideStatus status);

    Optional<Ride> findTopByDriverAndRideStatusOrderByRideTimeDesc(Driver driver, Ride.RideStatus status);

    long countByRideStatus(Ride.RideStatus status);
}
