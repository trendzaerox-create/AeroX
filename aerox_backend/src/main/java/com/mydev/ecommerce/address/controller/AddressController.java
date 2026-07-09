package com.mydev.ecommerce.address.controller;

import com.mydev.ecommerce.address.dto.AddressRequest;
import com.mydev.ecommerce.address.dto.AddressResponse;
import com.mydev.ecommerce.address.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public List<AddressResponse> getMyAddresses(Authentication authentication) {
        return addressService.getMyAddresses(authentication);
    }

    @PostMapping
    public AddressResponse create(
            Authentication authentication,
            @Valid @RequestBody AddressRequest request
    ) {
        return addressService.create(authentication, request);
    }

    @PutMapping("/{id}")
    public AddressResponse update(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request
    ) {
        return addressService.update(authentication, id, request);
    }

    @PutMapping("/{id}/default")
    public AddressResponse setDefault(Authentication authentication, @PathVariable Long id) {
        return addressService.setDefault(authentication, id);
    }

    @DeleteMapping("/{id}")
    public void delete(Authentication authentication, @PathVariable Long id) {
        addressService.delete(authentication, id);
    }
}