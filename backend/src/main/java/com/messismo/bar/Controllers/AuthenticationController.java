package com.messismo.bar.Controllers;

import com.messismo.bar.DTOs.*;
import com.messismo.bar.Services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final PasswordRecoveryService passwordRecoveryService;

    private final OrderService orderService;
    private final ProductService productService;
    private final DashboardService dashboardService;
    private final CategoryService categoryService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO request) {
        return authenticationService.register(request);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequestDTO request) {
        return authenticationService.authenticate(request);
    }

    // @PostMapping("/refresh-token")
    // public void refreshToken(HttpServletRequest request, HttpServletResponse
    // response) throws IOException {
    // authenticationService.refreshToken(request, response);
    // }

    @PostMapping("/forgotPassword")
    public ResponseEntity<String> forgotPassword(@RequestBody String email) {
        return passwordRecoveryService.forgotPassword(email);
    }

    @PostMapping("/changeForgottenPassword")
    public ResponseEntity<String> changeForgottenPassword(@RequestBody PasswordRecoveryDTO passwordRecoveryDTO) {
        return passwordRecoveryService.changeForgottenPassword(passwordRecoveryDTO);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.status(HttpStatus.OK).body("Server is up!");
    }


    @GetMapping("/getAllProducts")
    public ResponseEntity<?> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping("/addNewOrder")
    public ResponseEntity<?> addNewOrder(@RequestBody OrderRequestDTO orderRequestDTO) {
        return orderService.addNewOrder(orderRequestDTO);
    }

    @PostMapping("/modifyOrder")
    public ResponseEntity<?> modifyOrder(@RequestBody ModifyOrderDTO modifyOrderDTO) {
        return orderService.modifyOrder(modifyOrderDTO);
    }
    @PostMapping("/product/addProduct")
    public ResponseEntity<?> addProduct(@RequestBody ProductDTO productDTO) {
        return productService.addProduct(productDTO);
    }
    @GetMapping("orders/getAllOrders")
    public ResponseEntity<?> getAllOrders(){
        return orderService.getAllOrders();
    }

    @PostMapping("/dashboard/getDashboard")
    public ResponseEntity<?> getDashboardInformation(@RequestBody DashboardRequestDTO dashboardRequestDTO) {
        return dashboardService.getDashboardInformation(dashboardRequestDTO);
    }
    @GetMapping("/getAllCategories")
    public ResponseEntity<?> getAllCategories() {
        return categoryService.getAllCategories();
    }
}