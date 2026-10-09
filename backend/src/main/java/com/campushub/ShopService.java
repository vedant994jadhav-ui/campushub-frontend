package com.campushub;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class ShopService {
    private final DonationRepository donations;
    private final ProductRepository products;
    private final UserRepository users;
    private final ResourceRepository resources;

    public ShopService(DonationRepository donations, ProductRepository products,
                       UserRepository users, ResourceRepository resources) {
        this.donations = donations;
        this.products = products;
        this.users = users;
        this.resources = resources;
    }

    private ResponseStatusException notFound(String msg) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, msg);
    }

    // ---------- Donations ----------
    public Donation createDonation(Donation d) {
        if (!users.existsById(d.getUserId())) throw notFound("User not found with id " + d.getUserId());
        if (d.getResourceId() != null && !resources.existsById(d.getResourceId()))
            throw notFound("Resource not found with id " + d.getResourceId());
        d.setId(null);
        return donations.save(d);
    }

    public List<Donation> getDonations(Long userId) {
        if (userId != null) return donations.findByUserId(userId);
        return donations.findAll();
    }

    public void deleteDonation(Long id) {
        Donation d = donations.findById(id).orElseThrow(() -> notFound("Donation not found with id " + id));
        donations.delete(d);
    }

    // ---------- Products ----------
    public Product createProduct(Product p) {
        p.setId(null);
        return products.save(p);
    }

    public List<Product> getProducts(String category, String search) {
        if (search != null && !search.isBlank()) return products.findByNameContainingIgnoreCase(search);
        if (category != null && !category.isBlank()) return products.findByCategoryIgnoreCase(category);
        return products.findAll();
    }

    public Product getProduct(Long id) {
        return products.findById(id).orElseThrow(() -> notFound("Product not found with id " + id));
    }

    public Product updateProduct(Long id, Product data) {
        Product p = getProduct(id);
        p.setName(data.getName());
        p.setCategory(data.getCategory());
        p.setPrice(data.getPrice());
        p.setStock(data.getStock());
        return products.save(p);
    }

    public void deleteProduct(Long id) {
        products.delete(getProduct(id));
    }
}