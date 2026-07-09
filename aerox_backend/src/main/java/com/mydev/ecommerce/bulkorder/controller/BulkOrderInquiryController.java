package com.mydev.ecommerce.bulkorder.controller;

import com.mydev.ecommerce.bulkorder.dto.BulkOrderInquiryRequest;
import com.mydev.ecommerce.bulkorder.dto.BulkOrderInquiryResponse;
import com.mydev.ecommerce.bulkorder.service.BulkOrderInquiryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bulk-orders")
public class BulkOrderInquiryController {

    private final BulkOrderInquiryService bulkOrderInquiryService;

    public BulkOrderInquiryController(BulkOrderInquiryService bulkOrderInquiryService) {
        this.bulkOrderInquiryService = bulkOrderInquiryService;
    }

    @PostMapping
    public BulkOrderInquiryResponse create(@Valid @RequestBody BulkOrderInquiryRequest req) {
        return bulkOrderInquiryService.create(req);
    }
}