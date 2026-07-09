package com.mydev.ecommerce.auth.service;

import com.mydev.ecommerce.auth.dto.ResetPasswordRequest;
import com.mydev.ecommerce.auth.model.PasswordResetToken;
import com.mydev.ecommerce.auth.repository.PasswordResetTokenRepository;
import com.mydev.ecommerce.auth.dto.PasswordResetOptionsResponse;

import com.mydev.ecommerce.email.service.EmailService;
import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.frontend.reset-password-url:http://localhost:3000/reset-password}")
    private String resetPasswordUrl;

    @Value("${app.password-reset.expiry-minutes:30}")
    private long expiryMinutes;

    @Transactional
    public void requestReset(String email) {
        String cleanEmail = normalizeEmail(email);

        userRepository.findByEmailIgnoreCase(cleanEmail).ifPresentOrElse(user -> {
            expireOldActiveTokens(user);

            String rawToken = generateSecureToken();
            String tokenHash = hashToken(rawToken);

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setTokenHash(tokenHash);
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(expiryMinutes));

            passwordResetTokenRepository.save(resetToken);

            String resetLink = UriComponentsBuilder
                    .fromUriString(resetPasswordUrl)
                    .queryParam("token", rawToken)
                    .build()
                    .toUriString();

            String html = buildResetEmailHtml(user, resetLink);

            emailService.sendHtmlEmail(
                    cleanEmail,
                    "Reset your Trendz AeroX password",
                    html
            );

            log.info("Password reset email triggered for userId={}", user.getId());

        }, () -> {
            /*
             * Do not reveal whether this email exists.
             * Controller always returns the same success response.
             */
            log.warn("Password reset requested for non-existing email={}", cleanEmail);
        });
    }






    @Transactional(readOnly = true)
public PasswordResetOptionsResponse getResetOptions(String email) {
    String cleanEmail = normalizeEmail(email);

    return userRepository.findByEmailIgnoreCase(cleanEmail)
            .map(user -> new PasswordResetOptionsResponse(
                    true,
                    user.getEmail(),
                    user.getPhone() != null && !user.getPhone().isBlank(),
                    maskPhone(user.getPhone())
            ))
            .orElse(new PasswordResetOptionsResponse(
                    false,
                    cleanEmail,
                    false,
                    null
            ));
}

private String maskPhone(String phone) {
    String clean = phone == null ? "" : phone.replaceAll("\\D", "");

    if (clean.length() < 4) {
        return "XXXXXXXX";
    }

    return "XXXXXX" + clean.substring(clean.length() - 4);
}
















    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getRepeatPassword())) {
            throw new IllegalArgumentException("New password and repeat password do not match");
        }

        if (request.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }

        String tokenHash = hashToken(request.getToken());

        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByTokenHashAndUsedAtIsNull(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset link"));

        if (resetToken.isExpired()) {
            resetToken.setUsedAt(LocalDateTime.now());
            passwordResetTokenRepository.save(resetToken);
            throw new IllegalArgumentException("Reset link expired. Please request a new one.");
        }

        User user = resetToken.getUser();

        /*
         * Your User entity uses passwordHash, not password.
         * This fixes: cannot find symbol method setPassword(String)
         */
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

        resetToken.setUsedAt(LocalDateTime.now());

        userRepository.save(user);
        passwordResetTokenRepository.save(resetToken);

        log.info("Password reset success for userId={}", user.getId());
    }



    

    private void expireOldActiveTokens(User user) {
        List<PasswordResetToken> activeTokens =
                passwordResetTokenRepository.findByUserAndUsedAtIsNull(user);

        if (activeTokens.isEmpty()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        for (PasswordResetToken token : activeTokens) {
            token.setUsedAt(now);
        }

        passwordResetTokenRepository.saveAll(activeTokens);
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new IllegalStateException("Could not hash reset token", e);
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String buildResetEmailHtml(User user, String resetLink) {
        String name = user.getName() != null && !user.getName().isBlank()
                ? user.getName()
                : "Customer";

        return """
                <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;">
                  <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e5e7eb;">
                    <h2 style="margin:0 0 12px;color:#111827;">Reset your password</h2>

                    <p style="font-size:15px;color:#374151;line-height:1.6;">
                      Hi %s,
                    </p>

                    <p style="font-size:15px;color:#374151;line-height:1.6;">
                      We received a request to reset your Trendz AeroX account password.
                      Click the button below to create a new password.
                    </p>

                    <div style="margin:26px 0;">
                      <a href="%s"
                         style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:10px;font-weight:bold;">
                        Reset Password
                      </a>
                    </div>

                    <p style="font-size:13px;color:#6b7280;line-height:1.6;">
                      This link will expire in %d minutes.
                      If you did not request this, you can safely ignore this email.
                    </p>

                    <p style="font-size:12px;color:#9ca3af;line-height:1.6;margin-top:22px;">
                      If the button does not work, copy and paste this link into your browser:<br/>
                      <span style="word-break:break-all;">%s</span>
                    </p>
                  </div>
                </div>
                """.formatted(name, resetLink, expiryMinutes, resetLink);
    }
}