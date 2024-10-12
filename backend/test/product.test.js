// product.test.js
const { productList, addProduct, addProductSoldAmount, addProductStock, checkOutProduct } = require('../src/product');
const sql = require('../database');
const bcrypt = require("bcrypt");

jest.mock('../database');
jest.mock("bcrypt");

describe('Product Module', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('productList', () => {
        it('should return the product list successfully', async () => {
            const mockResult = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
            sql.query.mockResolvedValue(mockResult);

            const result = await productList();

            expect(sql.query).toHaveBeenCalledWith("SELECT * FROM `product`");
            expect(result).toEqual({
                status: 200,
                message: "Product sended to client successfully",
                list: mockResult
            });
        });

        it('should throw an error when query fails', async () => {
            const error = new Error('Query failed');
            sql.query.mockRejectedValue(error);

            await expect(productList()).rejects.toThrow('Query failed');
        });
    });

    describe('addProduct', () => {
        it('should add a product successfully', async () => {
            sql.query.mockResolvedValue();

            const result = await addProduct('Product 1', 'Description', 100);

            expect(sql.query).toHaveBeenCalledWith("INSERT INTO `product` (`name`, `description`, `price`) VALUES (?, ?, ?)", ['Product 1', 'Description', 100]);
            expect(result).toEqual({
                status: 201,
                message: "Product added successfully"
            });
        });

        it('should throw an error when adding product fails', async () => {
            const error = new Error('Insert failed');
            sql.query.mockRejectedValue(error);

            await expect(addProduct('Product 1', 'Description', 100)).rejects.toThrow('Insert failed');
        });
    });

    describe('addProductSoldAmount', () => {
        it('should update product sold amount successfully', async () => {
            sql.query.mockResolvedValue();

            const result = await addProductSoldAmount(1, 5);

            expect(sql.query).toHaveBeenCalledWith("UPDATE `product` SET `sold` = `sold` + ? WHERE `id` = ?", [5, 1]);
            expect(result).toEqual({
                status: 201,
                message: "Product updated"
            });
        });

        it('should throw an error when updating sold amount fails', async () => {
            const error = new Error('Update failed');
            sql.query.mockRejectedValue(error);

            await expect(addProductSoldAmount(1, 5)).rejects.toThrow('Update failed');
        });
    });

    describe('addProductStock', () => {
        it('should update product stock successfully', async () => {
            sql.query.mockResolvedValue();

            const result = await addProductStock(1, 10);

            expect(sql.query).toHaveBeenCalledWith("UPDATE `product` SET `stock` = `stock` + ? WHERE `id` = ?", [10, 1]);
            expect(result).toEqual({
                status: 201,
                message: "Stock added successfully"
            });
        });

        it('should throw an error when updating stock fails', async () => {
            const error = new Error('Update failed');
            sql.query.mockRejectedValue(error);

            await expect(addProductStock(1, 10)).rejects.toThrow('Update failed');
        });
    });

    describe('checkOutProduct', () => {
        it('should check out a product successfully', async () => {
            const mockResult = [{ id: 1, stock: 20 }];
            sql.query.mockResolvedValueOnce(mockResult).mockResolvedValueOnce();

            const result = await checkOutProduct(1, 5);

            expect(sql.query).toHaveBeenCalledWith("SELECT * FROM `product` WHERE `id` = ?", [1]);
            expect(sql.query).toHaveBeenCalledWith("UPDATE  `product` SET `stock` = `stock` - ? WHERE `id` = ?", [5, 1]);
            expect(result).toEqual({
                status: 200,
                message: "product checked out successfully"
            });
        });

        it('should return 409 when stock is insufficient', async () => {
            const mockResult = [{ id: 1, stock: 3 }];
            sql.query.mockResolvedValueOnce(mockResult);

            const result = await checkOutProduct(1, 5);

            expect(result).toEqual({
                status: 409,
                message: "Insufficient stock of goods or product not found"
            });
        });

        it('should return 404 when product is not found', async () => {
            sql.query.mockResolvedValueOnce([]);

            const result = await checkOutProduct(1, 5);

            expect(result).toEqual({
                status: 404,
                message: "Product not found"
            });
        });

        it('should throw an error when checking out product fails', async () => {
            const error = new Error('Checkout failed');
            sql.query.mockRejectedValue(error);

            await expect(checkOutProduct(1, 5)).rejects.toThrow('Checkout failed');
        });
    });
});

describe("Auth Module", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear any previous mocks
    });

    describe("createAccount", () => {
        it("should create an account successfully", async () => {
            // Mocking the existing username and email check
            sql.query.mockImplementation((query, params, callback) => {
                callback(null, []); // No existing users
            });
            bcrypt.hash.mockResolvedValue("hashedPassword");

            const result = await createAccount("testUser", "test@example.com", "password123");
            expect(result).toEqual({ status: 201, message: "Account created successfully" });
            expect(sql.query).toHaveBeenCalledWith(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                ["testUser", "test@example.com", "hashedPassword"]
            );
        });

        it("should return an error if username already exists", async () => {
            sql.query.mockImplementation((query, params, callback) => {
                callback(null, [{}]); // Mocking an existing user
            });

            const result = await createAccount("testUser", "test@example.com", "password123");
            expect(result).toEqual({ status: 409, message: "Username or Email already exists" });
        });

        it("should return an error if email already exists", async () => {
            sql.query.mockImplementation((query, params, callback) => {
                callback(null, []); // No existing users for username check
            });

            sql.query.mockImplementation((query, params, callback) => {
                callback(null, [{}]); // Mocking an existing email
            });

            const result = await createAccount("newUser", "test@example.com", "password123");
            expect(result).toEqual({ status: 409, message: "Username or Email already exists" });
        });

        it("should throw an error if SQL query fails", async () => {
            sql.query.mockImplementation((query, params, callback) => {
                callback(new Error("SQL Error"), null);
            });

            await expect(createAccount("testUser", "test@example.com", "password123")).rejects.toThrow("SQL Error");
        });
    });

    describe("loginUsername", () => {
        it("should login successfully with correct username and password", async () => {
            const mockUser = [{ username: "testUser", password: "hashedPassword" }];
            sql.query.mockImplementation((query, params, callback) => {
                callback(null, mockUser); // Mocking a found user
            });
            bcrypt.compare.mockResolvedValue(true); // Mocking successful password match

            const result = await loginUsername("testUser", "password123");
            expect(result).toEqual({ status: 200, message: "Login successful", account: mockUser });
        });

        it("should return error for invalid username", async () => {
            sql.query.mockImplementation((query, params, callback) => {
                callback(null, []); // No user found
            });

            const result = await loginUsername("wrongUser", "password123");
            expect(result).toEqual({ status: 401, message: "Invalid username or password" });
        });

        it("should return error for invalid password", async () => {
            const mockUser = [{ username: "testUser", password: "hashedPassword" }];
            sql.query.mockImplementation((query, params, callback) => {
                callback(null, mockUser); // Mocking a found user
            });
            bcrypt.compare.mockResolvedValue(false); // Mocking password mismatch

            const result = await loginUsername("testUser", "wrongPassword");
            expect(result).toEqual({ status: 401, message: "Invalid username or password" });
        });

        it("should throw an error if SQL query fails", async () => {
            sql.query.mockImplementation((query, params, callback) => {
                callback(new Error("SQL Error"), null);
            });

            await expect(loginUsername("testUser", "password123")).rejects.toThrow("SQL Error");
        });
    });

    describe("loginEmail", () => {
        it("should login successfully with correct email and password", async () => {
            const mockUser = [{ email: "test@example.com", password: "hashedPassword" }];
            sql.query.mockImplementation((query, params, callback) => {
                callback(null, mockUser); // Mocking a found user
            });
            bcrypt.compare.mockResolvedValue(true); // Mocking successful password match

            const result = await loginEmail("test@example.com", "password123");
            expect(result).toEqual({ status: 200, message: "Login successful", account: mockUser });
        });

        it("should return error for invalid email", async () => {
            sql.query.mockImplementation((query, params, callback) => {
                callback(null, []); // No user found
            });

            const result = await loginEmail("wrong@example.com", "password123");
            expect(result).toEqual({ status: 401, message: "Invalid email or password" });
        });

        it("should return error for invalid password", async () => {
            const mockUser = [{ email: "test@example.com", password: "hashedPassword" }];
            sql.query.mockImplementation((query, params, callback) => {
                callback(null, mockUser); // Mocking a found user
            });
            bcrypt.compare.mockResolvedValue(false); // Mocking password mismatch

            const result = await loginEmail("test@example.com", "wrongPassword");
            expect(result).toEqual({ status: 401, message: "Invalid email or password" });
        });

        it("should throw an error if SQL query fails", async () => {
            sql.query.mockImplementation((query, params, callback) => {
                callback(new Error("SQL Error"), null);
            });

            await expect(loginEmail("test@example.com", "password123")).rejects.toThrow("SQL Error");
        });
    });
});