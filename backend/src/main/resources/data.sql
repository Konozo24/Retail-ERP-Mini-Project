-- Email: user@gmail.com
-- Password: password
INSERT INTO USERS (EMAIL, PASSWD_CIPHERTEXT, CREATED_AT) VALUES 
('user@gmail.com', '$2a$10$X.Io2jJen9TuigZ2Y5RrBuCulYLSYnAL1cRPId8Y8lWwsmgLurn26', CURRENT_TIMESTAMP),
('manager@gmail.com', '$2a$10$X.Io2jJen9TuigZ2Y5RrBuCulYLSYnAL1cRPId8Y8lWwsmgLurn26', CURRENT_TIMESTAMP),
('yay@gmail.com', '$2a$10$X.Io2jJen9TuigZ2Y5RrBuCulYLSYnAL1cRPId8Y8lWwsmgLurn26', CURRENT_TIMESTAMP),
('gyat@gmail.com', '$2a$10$X.Io2jJen9TuigZ2Y5RrBuCulYLSYnAL1cRPId8Y8lWwsmgLurn26', CURRENT_TIMESTAMP);


-- 20 Test Customers
INSERT INTO CUSTOMERS (NAME, PHONE, EMAIL, CREATED_AT) VALUES
('John Doe', '0700000001', 'john.doe@example.com', CURRENT_TIMESTAMP),
('Jane Smith', '0700000002', 'jane.smith@example.com', CURRENT_TIMESTAMP),
('Michael Johnson', '0700000003', 'michael.johnson@example.com', CURRENT_TIMESTAMP),
('Emily Davis', '0700000004', 'emily.davis@example.com', CURRENT_TIMESTAMP),
('William Brown', '0700000005', 'william.brown@example.com', CURRENT_TIMESTAMP),
('Olivia Wilson', '0700000006', 'olivia.wilson@example.com', CURRENT_TIMESTAMP),
('James Taylor', '0700000007', 'james.taylor@example.com', CURRENT_TIMESTAMP),
('Sophia Moore', '0700000008', 'sophia.moore@example.com', CURRENT_TIMESTAMP),
('Benjamin Anderson', '0700000009', 'benjamin.anderson@example.com', CURRENT_TIMESTAMP),
('Ava Thomas', '0700000010', 'ava.thomas@example.com', CURRENT_TIMESTAMP),
('Elijah Jackson', '0700000011', 'elijah.jackson@example.com', CURRENT_TIMESTAMP),
('Isabella White', '0700000012', 'isabella.white@example.com', CURRENT_TIMESTAMP),
('Lucas Harris', '0700000013', 'lucas.harris@example.com', CURRENT_TIMESTAMP),
('Mia Martin', '0700000014', 'mia.martin@example.com', CURRENT_TIMESTAMP),
('Alexander Thompson', '0700000015', 'alexander.thompson@example.com', CURRENT_TIMESTAMP),
('Charlotte Garcia', '0700000016', 'charlotte.garcia@example.com', CURRENT_TIMESTAMP),
('Daniel Martinez', '0700000017', 'daniel.martinez@example.com', CURRENT_TIMESTAMP),
('Amelia Robinson', '0700000018', 'amelia.robinson@example.com', CURRENT_TIMESTAMP),
('Matthew Clark', '0700000019', 'matthew.clark@example.com', CURRENT_TIMESTAMP),
('Harper Rodriguez', '0700000020', 'harper.rodriguez@example.com', CURRENT_TIMESTAMP);


-- 20 test suppliers
INSERT INTO SUPPLIERS (NAME, PHONE, EMAIL, ADDRESS) VALUES
('Alpha Supplies', '0711000001', 'alpha@example.com', '123 Alpha Street'),
('Beta Traders', '0711000002', 'beta@example.com', '456 Beta Avenue'),
('Gamma Corp', '0711000003', 'gamma@example.com', '789 Gamma Road'),
('Delta Distributors', '0711000004', 'delta@example.com', '101 Delta Blvd'),
('Epsilon Ltd', '0711000005', 'epsilon@example.com', '202 Epsilon Lane'),
('Zeta Enterprises', '0711000006', 'zeta@example.com', '303 Zeta Street'),
('Eta Solutions', '0711000007', 'eta@example.com', '404 Eta Avenue'),
('Theta Suppliers', '0711000008', 'theta@example.com', '505 Theta Road'),
('Iota Inc', '0711000009', 'iota@example.com', '606 Iota Blvd'),
('Kappa Co', '0711000010', 'kappa@example.com', '707 Kappa Lane'),
('Lambda Logistics', '0711000011', 'lambda@example.com', '808 Lambda Street'),
('Mu Merchants', '0711000012', 'mu@example.com', '909 Mu Avenue'),
('Nu Networks', '0711000013', 'nu@example.com', '111 Nu Road'),
('Xi Exporters', '0711000014', 'xi@example.com', '222 Xi Blvd'),
('Omicron Suppliers', '0711000015', 'omicron@example.com', '333 Omicron Lane'),
('Pi Products', '0711000016', 'pi@example.com', '444 Pi Street'),
('Rho Retailers', '0711000017', 'rho@example.com', '555 Rho Avenue'),
('Sigma Services', '0711000018', 'sigma@example.com', '666 Sigma Road'),
('Tau Traders', '0711000019', 'tau@example.com', '777 Tau Blvd'),
('Upsilon Unlimited', '0711000020', 'upsilon@example.com', '888 Upsilon Lane');


-- Apple Products Test Data
INSERT INTO PRODUCTS (CREATED_BY, SKU, NAME, CATEGORY, UNIT_PRICE, COST_PRICE, STOCK_QTY, REORDER_LEVEL, CREATED_AT, UPDATED_AT) VALUES
(1, 'IP14-128GB-BLK', 'iPhone 14 128GB Black', 'Smartphone', 999.99, 799.99, 50, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'IP14-256GB-WHT', 'iPhone 14 256GB White', 'Smartphone', 1099.99, 879.99, 50, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'IP14PRO-128GB-SLV', 'iPhone 14 Pro 128GB Silver', 'Smartphone', 1199.99, 949.99, 40, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'IP14PRO-256GB-GLD', 'iPhone 14 Pro 256GB Gold', 'Smartphone', 1299.99, 1049.99, 40, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'IP14PROMAX-128GB-BLK', 'iPhone 14 Pro Max 128GB Black', 'Smartphone', 1299.99, 1049.99, 30, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'IP14PROMAX-256GB-WHT', 'iPhone 14 Pro Max 256GB White', 'Smartphone', 1399.99, 1149.99, 30, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'IP15-128GB-BLK', 'iPhone 15 128GB Black', 'Smartphone', 1099.99, 849.99, 50, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'IP15-256GB-WHT', 'iPhone 15 256GB White', 'Smartphone', 1199.99, 949.99, 50, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'IP15PRO-128GB-SLV', 'iPhone 15 Pro 128GB Silver', 'Smartphone', 1299.99, 1049.99, 40, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'IP15PRO-256GB-GRD', 'iPhone 15 Pro 256GB Gradient', 'Smartphone', 1399.99, 1149.99, 40, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'IP15PROMAX-128GB-BLK', 'iPhone 15 Pro Max 128GB Black', 'Smartphone', 1399.99, 1149.99, 30, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'IP15PROMAX-256GB-WHT', 'iPhone 15 Pro Max 256GB White', 'Smartphone', 1499.99, 1249.99, 30, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'IPAD10-64GB-SLV', 'iPad 10th Gen 64GB Silver', 'Tablet', 499.99, 399.99, 60, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'IPAD10-256GB-GRY', 'iPad 10th Gen 256GB Gray', 'Tablet', 599.99, 479.99, 60, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'IPADPRO11-128GB-SLV', 'iPad Pro 11-inch 128GB Silver', 'Tablet', 799.99, 649.99, 40, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'IPADPRO11-256GB-GRY', 'iPad Pro 11-inch 256GB Gray', 'Tablet', 899.99, 749.99, 40, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'IPADPRO12-512GB-GRD', 'iPad Pro 12.9-inch 512GB Gradient', 'Tablet', 1299.99, 1049.99, 30, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'MACBOOKAIRM2-256GB-SLV', 'MacBook Air M2 256GB Silver', 'Laptop', 1199.99, 949.99, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'MACBOOKAIRM2-512GB-GRY', 'MacBook Air M2 512GB Gray', 'Laptop', 1399.99, 1149.99, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'MACBOOKPROM2-512GB-SLV', 'MacBook Pro M2 512GB Silver', 'Laptop', 1999.99, 1599.99, 20, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'MACBOOKPROM2-1TB-GRY', 'MacBook Pro M2 1TB Gray', 'Laptop', 2299.99, 1849.99, 20, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'MACMINIM2-256GB-SLV', 'Mac Mini M2 256GB Silver', 'Desktop', 699.99, 549.99, 15, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'MACMINIM2-512GB-GRY', 'Mac Mini M2 512GB Gray', 'Desktop', 899.99, 749.99, 15, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'APPLEWATCHSE-GRY', 'Apple Watch SE Gray', 'Wearable', 279.99, 199.99, 50, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'APPLEWATCHULTRA-BLK', 'Apple Watch Ultra Black', 'Wearable', 799.99, 649.99, 40, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'AIRPODSPRO2', 'AirPods Pro 2nd Gen', 'Audio', 249.99, 199.99, 60, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'AIRPODS3', 'AirPods 3rd Gen', 'Audio', 179.99, 149.99, 60, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'HOMEPODMINI-WHT', 'HomePod mini White', 'Audio', 99.99, 79.99, 30, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'IPODTOUCH7-32GB', 'iPod Touch 7th Gen 32GB', 'Audio', 199.99, 149.99, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'IPODTOUCH7-128GB', 'iPod Touch 7th Gen 128GB', 'Audio', 299.99, 249.99, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Purchase Orders
INSERT INTO PURCHASE_ORDER (SUPP_ID, USER_ID, STATUS, CREATED_AT) VALUES
(1, 1, 'COMPLETED', CURRENT_TIMESTAMP),
(2, 2, 'COMPLETED', CURRENT_TIMESTAMP),
(3, 3, 'COMPLETED', CURRENT_TIMESTAMP),
(4, 4, 'COMPLETED', CURRENT_TIMESTAMP);

-- Purchase Order Items
-- PurchaseOrder 1: Supplier 1, User 1
INSERT INTO PURCHASE_ORDER_ITEM (PO_ID, PROD_ID, QUANTITY, UNIT_COST, SUBTOTAL) VALUES
(1, 1, 50, 799.99, 799.99*50),
(1, 2, 50, 879.99, 879.99*50),
(1, 3, 40, 949.99, 949.99*40);

-- PurchaseOrder 2: Supplier 2, User 2
INSERT INTO PURCHASE_ORDER_ITEM (PO_ID, PROD_ID, QUANTITY, UNIT_COST, SUBTOTAL) VALUES
(2, 4, 40, 1049.99, 1049.99*40),
(2, 5, 30, 1049.99, 1049.99*30),
(2, 6, 30, 1149.99, 1149.99*30);

-- PurchaseOrder 3: Supplier 3, User 3
INSERT INTO PURCHASE_ORDER_ITEM (PO_ID, PROD_ID, QUANTITY, UNIT_COST, SUBTOTAL) VALUES
(3, 7, 50, 849.99, 849.99*50),
(3, 8, 50, 949.99, 949.99*50),
(3, 9, 40, 1049.99, 1049.99*40);

-- PurchaseOrder 4: Supplier 4, User 4
INSERT INTO PURCHASE_ORDER_ITEM (PO_ID, PROD_ID, QUANTITY, UNIT_COST, SUBTOTAL) VALUES
(4, 10, 30, 1149.99, 1149.99*30),
(4, 11, 30, 1149.99, 1149.99*30),
(4, 12, 25, 1149.99, 1149.99*25);

-- Sales Orders
INSERT INTO SALES_ORDER (USER_ID, CUST_ID, TOTAL_AMOUNT, PAYMENT_METHOD, CREATED_AT) VALUES
(1, 1, 50000, 'Card', CURRENT_TIMESTAMP),
(2, 2, 30000, 'Cash', CURRENT_TIMESTAMP),
(3, 3, 40000, 'Card', CURRENT_TIMESTAMP),
(4, 4, 25000, 'Card', CURRENT_TIMESTAMP);



-- Sales Order Items
-- SalesOrder 1: User 1, Customer 1
INSERT INTO SALES_ORDER_ITEM (SO_ID, PROD_ID, QUANTITY, UNIT_PRICE, SUBTOTAL) VALUES
(1, 1, 30, 999.99, 999.99*30),
(1, 2, 25, 1099.99, 1099.99*25);

-- SalesOrder 2: User 2, Customer 2
INSERT INTO SALES_ORDER_ITEM (SO_ID, PROD_ID, QUANTITY, UNIT_PRICE, SUBTOTAL) VALUES
(2, 3, 20, 1199.99, 1199.99*20),
(2, 4, 15, 1299.99, 1299.99*15);

-- SalesOrder 3: User 3, Customer 3
INSERT INTO SALES_ORDER_ITEM (SO_ID, PROD_ID, QUANTITY, UNIT_PRICE, SUBTOTAL) VALUES
(3, 5, 15, 1299.99, 1299.99*15),
(3, 6, 10, 1399.99, 1399.99*10);

-- SalesOrder 4: User 4, Customer 4
INSERT INTO SALES_ORDER_ITEM (SO_ID, PROD_ID, QUANTITY, UNIT_PRICE, SUBTOTAL) VALUES
(4, 7, 25, 1099.99, 1099.99*25),
(4, 8, 30, 1199.99, 1199.99*30);



-- Update product qty accordingly
UPDATE PRODUCTS p
SET STOCK_QTY = (
    SELECT
        COALESCE(SUM(po_item.QUANTITY),0) - COALESCE(SUM(so_item.QUANTITY),0)
    FROM PRODUCTS p2
    LEFT JOIN PURCHASE_ORDER_ITEM po_item ON p2.PROD_ID = po_item.PROD_ID
    LEFT JOIN SALES_ORDER_ITEM so_item ON p2.PROD_ID = so_item.PROD_ID
    WHERE p2.PROD_ID = p.PROD_ID
    GROUP BY p2.PROD_ID
);
