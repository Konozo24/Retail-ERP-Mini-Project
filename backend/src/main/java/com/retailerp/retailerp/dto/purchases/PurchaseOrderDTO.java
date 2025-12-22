package com.retailerp.retailerp.dto.purchases;

import java.time.format.DateTimeFormatter;
import java.util.List;

import com.retailerp.retailerp.model.PurchaseOrder;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PurchaseOrderDTO {

	private Long id;

	private String supplier;

	private String user;

	private String status;

	private String createdAt;

	private List<PurchaseOrderItemDTO> items;

	public static PurchaseOrderDTO fromEntity(PurchaseOrder purchaseOrder)
	{
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM yyyy");
		return PurchaseOrderDTO.builder()
			.id(purchaseOrder.getId())
			.supplier(purchaseOrder.getSupplier().getName())
			.user(purchaseOrder.getUser().getEmail())
			.status(purchaseOrder.getStatus().name())
			.createdAt(purchaseOrder.getCreatedAt().format(formatter))
			.items(PurchaseOrderItemDTO.fromEntities(purchaseOrder.getItems()))
			.build();
	}

}
