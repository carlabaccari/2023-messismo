package com.messismo.bar.ServicesTests;

import com.messismo.bar.DTOs.*;
import com.messismo.bar.Entities.*;

import com.messismo.bar.Exceptions.ComboNotFoundException;
import com.messismo.bar.Exceptions.ExistingComboNameFoundException;
import com.messismo.bar.Exceptions.ProductNotFoundException;
import com.messismo.bar.Repositories.ComboOrderRepository;
import com.messismo.bar.Repositories.ComboRepository;
import com.messismo.bar.Repositories.OrderRepository;
import com.messismo.bar.Repositories.ProductRepository;
import com.messismo.bar.Services.ComboService;
import com.messismo.bar.Services.OrderService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.text.SimpleDateFormat;
import java.util.*;

import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.*;

public class ComboServiceTest {

    @InjectMocks
    private ComboService comboService;

    @Mock
    private ComboRepository comboRepository;

    @Mock
    private ProductRepository productRepository;

    @BeforeEach
    public void setUp() {

        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllCombos() {

        List<Combo> mockOrders = new ArrayList<>();
        when(comboRepository.findAll()).thenReturn(mockOrders);
        List<?> response = comboService.getAllCombos();

        verify(comboRepository, times(1)).findAll();
        Assertions.assertEquals(mockOrders, response);

    }

    @Test
    public void testAddNewCombo() throws Exception, ExistingComboNameFoundException {

        ProductDTO product1 = new ProductDTO();
        product1.setName("Product A");
        product1.setUnitPrice(2000.0);
        product1.setUnitCost(1000.0);
        product1.setCategory("Category 1");
        product1.setDescription("Description A");
        product1.setStock(10);
        product1.setProfit(50.0);


        ProductDTO product2 = new ProductDTO();
        product2.setName("Product B");
        product2.setUnitPrice(3000.0);
        product2.setUnitCost(1500.0);
        product2.setCategory("Category 2");
        product2.setDescription("Description B");
        product2.setStock(5);
        product2.setProfit(50.0);

        List<ProductComboDTO> productCombos = Arrays.asList(
                new ProductComboDTO(null, "Producto A", 2),
                new ProductComboDTO(null, "Producto B", 3)
        );

        ComboDTO comboDTO = new ComboDTO();
        comboDTO.setName("Combo Test");
        comboDTO.setProducts(productCombos);
        comboDTO.setPrice(15000.0);
        comboDTO.setTotalCost(8500.0);
        comboDTO.setProfit(65.0);

        Combo expectedCombo = new Combo();
        expectedCombo.setId(1L);
        expectedCombo.setName("Combo Test");
        expectedCombo.setProducts(new ArrayList<>());
        expectedCombo.setPrice(15000.0);
        expectedCombo.setProfit(65.0);

        when(comboService.addCombo(comboDTO)).thenReturn(expectedCombo);

        Combo result = comboService.addCombo(comboDTO);
        Assertions.assertNotNull(result);
        Assertions.assertEquals(expectedCombo.getName(), result.getName());
        Assertions.assertEquals(expectedCombo.getPrice(), result.getPrice());
        Assertions.assertEquals(expectedCombo.getProfit(), result.getProfit());


    }


    @Test
    public void testAddCombo_Exception_DuplicateName() {

        Category category1 = Category.builder().categoryId(1L).name("Entrada").build();

        Product product1 = Product.builder()
                .productId(1L)
                .name("Empanadas")
                .stock(50)
                .category(category1)
                .unitPrice(50.00)
                .unitCost(20.00)
                .description("Empanadas de carne")
                .build();

        ProductComboDTO productComboDTO = ProductComboDTO.builder()
                .productId(product1.getProductId())
                .quantity(2)
                .build();

        ComboDTO comboDTO = ComboDTO.builder()
                .name("Combo 1")
                .products(List.of(productComboDTO))
                .price(100.00)
                .profit(20.00)
                .build();

        when(comboRepository.findByName("Combo 1"))
                .thenReturn(Optional.of(new Combo()));

        Exception exception = assertThrows(ExistingComboNameFoundException.class, () -> {
            comboService.addCombo(comboDTO);
        });

        Assertions.assertEquals("This name is already in use", exception.getMessage());
    }


    @Test
    public void testUpdateComboPrice_Success() throws Exception {

        Category category = new Category(1L, "Entrada");
        Product product1 = new Product("Empanadas", 6000.00, 4000.00, "Empanadas de carne", 20, category);
        Product product2 = new Product("Ensalada", 4000.00, 3000.00, "Ensalada de pollo", 12, category);
        Combo existingCombo = new Combo(
                1L,
                "Combo 1",
                List.of(new ProductCombo(product1, 2), new ProductCombo(product2, 1)),
                100.0,
                30.0
        );

        ComboPriceDTO comboPriceDTO = new ComboPriceDTO(
                1L,
                150.00
        );


        when(comboRepository.findById(existingCombo.getId())).thenReturn(Optional.of(existingCombo));
        when(comboRepository.save(any(Combo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = comboService.modifyComboPrice(comboPriceDTO);

        Assertions.assertEquals("Product price updated successfully", result);
        Assertions.assertEquals(150.00, existingCombo.getPrice());

    }


    @Test
    public void testUpdateComboProfit_Succes() throws Exception {

        Category category = new Category(1L, "Entrada");
        Product product1 = new Product("Empanadas", 6000.00, 4000.00, "Empanadas de carne", 20, category);
        Product product2 = new Product("Ensalada", 4000.00, 3000.00, "Ensalada de pollo", 12, category);
        Combo existingCombo = new Combo(
                1L,
                "Combo 1",
                List.of(new ProductCombo(product1, 2), new ProductCombo(product2, 1)),
                100.00,
                30.0
        );

        comboRepository.save(existingCombo);

        ComboProfitDTO comboProfitDTO = new ComboProfitDTO(
                1L,
                50.00
        );


        when(comboRepository.findById(existingCombo.getId())).thenReturn(Optional.of(existingCombo));
        when(comboRepository.save(any(Combo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = comboService.modifyComboProfit(comboProfitDTO);

        Assertions.assertEquals("Combo profit updated successfully", result);
        Assertions.assertEquals(50.00, existingCombo.getProfit());

    }

    @Test
    public void testModifyComboProfit_ComboNotFound() {
        Long nonExistentComboId = 999L;
        Double newProfit = 40.0;

        ComboProfitDTO comboProfitDTO = new ComboProfitDTO(nonExistentComboId, newProfit);

        when(comboRepository.findById(nonExistentComboId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ComboNotFoundException.class, () -> {
            comboService.modifyComboProfit(comboProfitDTO);
        });

        Assertions.assertEquals("ComboId DOES NOT match any comboId", exception.getMessage());

    }

    @Test
    public void testModifyComboPricet_ComboNotFound() {
        Long nonExistentComboId = 999L;
        Double newPrice = 4000.0;

        ComboPriceDTO comboPriceDTO = new ComboPriceDTO(nonExistentComboId, newPrice);

        when(comboRepository.findById(nonExistentComboId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ComboNotFoundException.class, () -> {
            comboService.modifyComboPrice(comboPriceDTO);
        });

        Assertions.assertEquals("ComboId DOES NOT match any comboId", exception.getMessage());

    }

}

