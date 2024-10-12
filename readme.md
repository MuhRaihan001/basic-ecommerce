
---

# Product Management API

This API allows you to manage products, including listing products, adding new products, updating product details, and checking out products.

## Base URL

```
/api/products
```

## Endpoints

### 1. List Products

- **Method:** `GET`
- **Endpoint:** `/`
- **Description:** Retrieve a list of all products.

#### Response

- **Status 200:** 
  ```json
  {
    "status": 200,
    "message": "Product list sent to client successfully",
    "list": [ /* Array of product objects */ ]
  }
  ```
- **Status 500:** 
  ```json
  {
    "status": 500,
    "message": "Internal server error"
  }
  ```

---

### 2. Add Product

- **Method:** `POST`
- **Endpoint:** `/add`
- **Description:** Add a new product to the inventory.

#### Request Body

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number"
}
```

#### Response

- **Status 201:**
  ```json
  {
    "status": 201,
    "message": "Product added successfully"
  }
  ```
- **Status 500:** 
  ```json
  {
    "status": 500,
    "message": "Internal server error"
  }
  ```

---

### 3. Change Product Price

- **Method:** `PUT`
- **Endpoint:** `/:id/price`
- **Description:** Update the price of a specific product.

#### URL Parameters

- `id` (string): The ID of the product.

#### Request Body

```json
{
  "newPrice": "number"
}
```

#### Response

- **Status 200:**
  ```json
  {
    "status": 200,
    "message": "Product price changed successfully"
  }
  ```
- **Status 500:**
  ```json
  {
    "status": 500,
    "message": "Internal server error"
  }
  ```

---

### 4. Update Product Sold Amount

- **Method:** `PUT`
- **Endpoint:** `/:id/sold`
- **Description:** Increment the sold amount for a specific product.

#### URL Parameters

- `id` (string): The ID of the product.

#### Request Body

```json
{
  "amount": "number"
}
```

#### Response

- **Status 201:**
  ```json
  {
    "status": 201,
    "message": "Product sold amount updated"
  }
  ```
- **Status 500:**
  ```json
  {
    "status": 500,
    "message": "Internal server error"
  }
  ```

---

### 5. Update Product Stock

- **Method:** `PUT`
- **Endpoint:** `/:id/stock`
- **Description:** Add stock to a specific product.

#### URL Parameters

- `id` (string): The ID of the product.

#### Request Body

```json
{
  "amount": "number"
}
```

#### Response

- **Status 201:**
  ```json
  {
    "status": 201,
    "message": "Stock added successfully"
  }
  ```
- **Status 500:**
  ```json
  {
    "status": 500,
    "message": "Internal server error"
  }
  ```

---

### 6. Check Out Product

- **Method:** `POST`
- **Endpoint:** `/:id/checkout`
- **Description:** Check out a specific amount of a product.

#### URL Parameters

- `id` (string): The ID of the product.

#### Request Body

```json
{
  "amount": "number"
}
```

#### Response

- **Status 200:**
  ```json
  {
    "status": 200,
    "message": "Product checked out successfully"
  }
  ```
- **Status 404:** 
  ```json
  {
    "status": 404,
    "message": "Product not found"
  }
  ```
- **Status 409:**
  ```json
  {
    "status": 409,
    "message": "Insufficient stock of goods"
  }
  ```
- **Status 500:**
  ```json
  {
    "status": 500,
    "message": "Internal server error"
  }
  ```

---

### 7. Find Product

- **Method:** `GET`
- **Endpoint:** `/find/:name`
- **Description:** Search for a product by name.

#### URL Parameters

- `name` (string): The name of the product to search for.

#### Response

- **Status 200:**
  ```json
  {
    "status": 200,
    "message": "Product found successfully",
    "product": { /* Product object */ }
  }
  ```
- **Status 404:**
  ```json
  {
    "status": 404,
    "message": "Product not found"
  }
  ```
- **Status 500:**
  ```json
  {
    "status": 500,
    "message": "Internal server error"
  }
  ```

---

## Error Handling

For all endpoints, a general error response will be returned in the event of an internal server error. The structure of the error response will be:

```json
{
  "status": 500,
  "message": "Internal server error"
}
```

---

This documentation should help users understand how to interact with the Product Management API, covering all key aspects of its functionality.