package com.campushub;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174","http://localhost:3000"})
public class LibraryController {
    private final ShopService service;

    public LibraryController(ShopService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@Valid @RequestBody Product p) { return service.createProduct(p); }

    @GetMapping("/resourses")
    public List<Product> list(@RequestParam(required = false) String category,
                              @RequestParam(required = false) String search) {
        return service.getProducts(category, search);
    }

    @GetMapping("/{id}")
    public Product get(@PathVariable Long id) { return service.getProduct(id); }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody Product p) {
        return service.updateProduct(id, p);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.deleteProduct(id); }
}