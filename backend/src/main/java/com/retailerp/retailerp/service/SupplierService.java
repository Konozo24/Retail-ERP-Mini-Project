package com.retailerp.retailerp.service;

import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailerp.retailerp.dto.supplier.SupplierDTO;
import com.retailerp.retailerp.dto.supplier.SupplierRequestDTO;
import com.retailerp.retailerp.model.Supplier;
import com.retailerp.retailerp.repository.SupplierRepository;
import com.retailerp.retailerp.repository.spec.SupplierSpec;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class SupplierService {
    
    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public Page<SupplierDTO> getSuppliers(String search, Pageable pageable) {
        Specification<Supplier> spec = SupplierSpec.getSpecification(search);
        return supplierRepository.findAll(spec, pageable)
            .map(SupplierDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public SupplierDTO getSupplier(Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId).orElseThrow(
            () -> new NoSuchElementException("Supplier with id, " + supplierId + " doesn't exist!")
        );
        return SupplierDTO.fromEntity(supplier);
    }

    @Transactional
    public SupplierDTO createSupplier(SupplierRequestDTO request) {
        Supplier newSupplier = supplierRepository.save(
            new Supplier(request.getName(), request.getPhone(), request.getEmail(), request.getAddress())
        );
        return SupplierDTO.fromEntity(newSupplier);
    }

    @Transactional
    public void updateSupplier(Long supplierId, SupplierRequestDTO request) {
        Supplier existing = supplierRepository.findById(supplierId).orElseThrow(
            () -> new NoSuchElementException("Supplier with id, " + supplierId + " doesn't exist!")
        );

        existing.setName(request.getName());
        existing.setPhone(request.getPhone());
        existing.setEmail(request.getEmail());
        existing.setAddress(request.getAddress());
        supplierRepository.save(existing);
    }

    @Transactional
    public void removeSupplier(Long supplierId) {
        Supplier existing = supplierRepository.findById(supplierId).orElseThrow(
            () -> new NoSuchElementException("Supplier with id, " + supplierId + " doesn't exist!")
        );
        
        if (!existing.isInactive()) {
            existing.setInactive(true);
            supplierRepository.save(existing);
        }
    }
}
