package com.rideshare.config;

import com.rideshare.entity.User;
import com.rideshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed admin user if not exists
        if (!userRepository.existsByEmail("admin@rideshare.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@rideshare.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("9999999999")
                    .role(User.Role.ADMIN)
                    .blocked(false)
                    .build();
            userRepository.save(admin);
            log.info("✅ Default admin created: admin@rideshare.com / admin123");
        } else {
            log.info("✅ Admin user already exists");
        }
    }
}
