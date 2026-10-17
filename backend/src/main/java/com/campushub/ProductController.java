package com.campushub;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ShopService service;

    public ProductController(ShopService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@Valid @RequestBody Product p) { return service.createProduct(p); }

    @GetMapping
    public List<Product> list(
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "search", required = false) String search) {
        return service.getProducts(category, search);
    }

    @GetMapping("/{id:\\d+}")
    public Product get(@PathVariable("id") Long id) { return service.getProduct(id); }

    @PutMapping("/{id:\\d+}")
    public Product update(@PathVariable("id") Long id, @Valid @RequestBody Product p) {
        return service.updateProduct(id, p);
    }

    @DeleteMapping("/{id:\\d+}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) { service.deleteProduct(id); }
}