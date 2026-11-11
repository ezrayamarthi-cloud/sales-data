package com.enterprise.sales.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales", indexes = {
    @Index(name = "idx_sales_order_date", columnList = "order_date"),
    @Index(name = "idx_sales_order_id", columnList = "order_id", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "sale_id", length = 36)
    private String id;

    @NotBlank
    @Column(name = "order_id", nullable = false, unique = true, length = 50)
    private String orderId;

    @NotNull
    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @NotNull
    @Column(name = "unit_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitCost;

    @Column(precision = 14, scale = 2, insertable = false, updatable = false)
    private BigDecimal revenue;

    @Column(precision = 14, scale = 2, insertable = false, updatable = false)
    private BigDecimal cost;

    @Column(precision = 14, scale = 2, insertable = false, updatable = false)
    private BigDecimal profit;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 30)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private OrderStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PaymentMethod {
        CREDIT_CARD, WIRE_TRANSFER, ACH, PAYPAL
    }

    public enum OrderStatus {
        COMPLETED, PENDING, SHIPPED, CANCELLED
    }
}
