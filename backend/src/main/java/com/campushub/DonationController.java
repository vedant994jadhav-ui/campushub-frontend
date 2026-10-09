package com.campushub;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DonationController {
    private final ShopService service;

    public DonationController(ShopService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Donation create(@Valid @RequestBody Donation d) { return service.createDonation(d); }

    @GetMapping
    public List<Donation> list(@RequestParam(required = false) Long userId) { return service.getDonations(userId); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.deleteDonation(id); }
}