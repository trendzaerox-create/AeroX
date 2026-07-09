package com.mydev.ecommerce.bulkorder.controller;

import com.mydev.ecommerce.bulkorder.dto.BulkOrderInquiryResponse;
import com.mydev.ecommerce.bulkorder.dto.BulkOrderStatusUpdateRequest;
import com.mydev.ecommerce.bulkorder.service.BulkOrderInquiryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bulk-orders")
public class AdminBulkOrderInquiryController {

    private final BulkOrderInquiryService bulkOrderInquiryService;

    public AdminBulkOrderInquiryController(BulkOrderInquiryService bulkOrderInquiryService) {
        this.bulkOrderInquiryService = bulkOrderInquiryService;
    }

    @GetMapping
    public List<BulkOrderInquiryResponse> list() {
        return bulkOrderInquiryService.getAll();
    }

    @GetMapping("/{id}")
    public BulkOrderInquiryResponse one(@PathVariable Long id) {
        return bulkOrderInquiryService.getOne(id);
    }

    @PutMapping("/{id}/status")
    public BulkOrderInquiryResponse updateStatus(@PathVariable Long id,
                                                 @Valid @RequestBody BulkOrderStatusUpdateRequest req) {
        return bulkOrderInquiryService.updateStatus(id, req);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
    bulkOrderInquiryService.delete(id);
    }


}