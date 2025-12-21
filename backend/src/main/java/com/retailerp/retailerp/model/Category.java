package com.retailerp.retailerp.model;

import java.util.List;

import org.springframework.data.annotation.Transient;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(
    name = "CATEGORIES",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "UK_CATEGORY_NAME",
            columnNames = "NAME"
        )
    }
)
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CATEGORY_ID")
    private Long id;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Product> products;

    @Column(name = "NAME", length = 100, nullable = false)
    private String name;

    @Column(name = "PREFIX", length = 10, nullable = false)
    private String prefix;

    @Column(name = "COLOR", length = 9, nullable = false)
    private String color = "#FFFFFF";

    @Lob
    @Column(name = "IMAGE", columnDefinition = "LONGTEXT")
    private String image;

    @Column(name = "INACTIVE", nullable = false)
    private boolean inactive = false;

    public Category(String name, String prefix) {
        this.name = name;
        this.prefix = prefix.toUpperCase();
    }

    @Transient
    public int getProductCount() {
        return products == null ? 0 : products.size();
    }
}
