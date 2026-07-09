
package com.mydev.ecommerce.address.service;

import com.mydev.ecommerce.address.dto.AddressRequest;
import com.mydev.ecommerce.address.dto.AddressResponse;
import com.mydev.ecommerce.address.model.Address;
import com.mydev.ecommerce.address.repository.AddressRepository;
import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressResponse> getMyAddresses(Authentication authentication) {
        User user = getUser(authentication);
        return addressRepository.findByUserIdOrderByIdDesc(user.getId())
                .stream()
                .map(this::map)
                .toList();
    }

    public AddressResponse create(Authentication authentication, AddressRequest request) {
        User user = getUser(authentication);

        List<Address> existingAddresses = addressRepository.findByUserIdOrderByIdDesc(user.getId());
        boolean hasAnyAddress = !existingAddresses.isEmpty();
        boolean makeDefault = Boolean.TRUE.equals(request.isDefault()) || !hasAnyAddress;

        if (makeDefault) {
            clearDefault(user.getId());
        }

        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.fullName());
        address.setPhone(request.phone());
        address.setLine1(request.line1());
        address.setLine2(request.line2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setPincode(request.pincode());
        address.setCountry(request.country() == null || request.country().isBlank() ? "India" : request.country());
        address.setIsDefault(makeDefault);

        return map(addressRepository.save(address));
    }

    public AddressResponse update(Authentication authentication, Long id, AddressRequest request) {
        User user = getUser(authentication);

        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        List<Address> userAddresses = addressRepository.findByUserIdOrderByIdDesc(user.getId());
        boolean isOnlyAddress = userAddresses.size() == 1;

        boolean makeDefault = Boolean.TRUE.equals(request.isDefault());

        if (isOnlyAddress) {
            makeDefault = true;
        }

        if (makeDefault) {
            clearDefault(user.getId());
        } else if (Boolean.TRUE.equals(address.getIsDefault())) {
            makeDefault = true;
        }

        address.setFullName(request.fullName());
        address.setPhone(request.phone());
        address.setLine1(request.line1());
        address.setLine2(request.line2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setPincode(request.pincode());
        address.setCountry(request.country() == null || request.country().isBlank() ? "India" : request.country());
        address.setIsDefault(makeDefault);

        return map(addressRepository.save(address));
    }

    public void delete(Authentication authentication, Long id) {
        User user = getUser(authentication);

        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        addressRepository.delete(address);

        if (wasDefault) {
            List<Address> remaining = addressRepository.findByUserIdOrderByIdDesc(user.getId());
            if (!remaining.isEmpty()) {
                Address nextDefault = remaining.get(0);
                nextDefault.setIsDefault(true);
                addressRepository.save(nextDefault);
            }
        }
    }

    public AddressResponse setDefault(Authentication authentication, Long id) {
        User user = getUser(authentication);

        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        clearDefault(user.getId());
        address.setIsDefault(true);

        return map(addressRepository.save(address));
    }

    private void clearDefault(Long userId) {
        List<Address> addresses = addressRepository.findByUserIdOrderByIdDesc(userId);
        for (Address a : addresses) {
            if (Boolean.TRUE.equals(a.getIsDefault())) {
                a.setIsDefault(false);
            }
        }
        addressRepository.saveAll(addresses);
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private AddressResponse map(Address a) {
        return new AddressResponse(
                a.getId(),
                a.getFullName(),
                a.getPhone(),
                a.getLine1(),
                a.getLine2(),
                a.getCity(),
                a.getState(),
                a.getPincode(),
                a.getCountry(),
                a.getIsDefault()
        );
    }
}