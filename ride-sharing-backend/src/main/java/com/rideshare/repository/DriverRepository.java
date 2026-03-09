package com.rideshare.repository;

import com.rideshare.entity.Driver;
import com.rideshare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUser(User user);

    Optional<Driver> findByUser_Id(Long userId);

    List<Driver> findByAvailabilityStatusTrue();

    List<Driver> findByVehicleTypeAndAvailabilityStatusTrue(Driver.VehicleType vehicleType);

    boolean existsByUser(User user);
}
