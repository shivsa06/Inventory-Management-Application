Inventory Management Application
A full-stack web application to manage inventory, items, and purchases. Built with React (frontend) and Node.js/Express (backend) with MySQL database.

Features:-
Item Management: Add, update, delete, and view items with name, price, and type.
Inventory Management: Track item quantities, add new inventory, and update stock.
Purchase Management: Create, update, delete, and view purchases with customer details and item quantities.
Purchase Details: View and edit individual purchase details, including item quantities and subtotals.
Responsive UI: Built with Material-UI for a clean and user-friendly interface.

Tech Stack :-
Frontend: React, Material-UI, Axios
Backend: Node.js, Express.js
Database: MySQL
API: RESTful APIs for CRUD operations
Folder Structure:
src/components/: React components (ItemForm.js, PurchaseForm.js, Table.js, etc.)
src/pages/:- Pages of Application (Home.js, Inventory.js, Items.js, etc.)
src/routes/: Backend routes (createPurchase.js, updatePurchaseDetails.js, etc.)
src/config/: Database configuration (database.js)

Prerequisites :-
Node.js (v16 or higher)
MySQL (v8 or higher)
npm (v8 or higher)

Setup Instructions:-
1. Clone the Repository:
git clone https://github.com/shivsa06/Store-Application
cd Store-Application

2. Backend Setup :-
    Navigate to the backend directory: cd backend
    Install dependencies: npm install

3. Configure MySQL database:-
    Create a database named store_app
    Update src/config/database.js with your MySQL credentials

4. Run database migrations (create tables):
CREATE TABLE ItemTypes (
  type_id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(255) NOT NULL
);

CREATE TABLE Items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  type_id INT,
  FOREIGN KEY (type_id) REFERENCES ItemTypes(type_id)
);

CREATE TABLE Inventory (
  inventory_id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT,
  quantity INT NOT NULL,
  FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE Purchases (
  purchase_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  purchase_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE PurchaseDetails (
  detail_id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_id INT,
  item_id INT,
  quantity INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES Purchases(purchase_id),
  FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

5. Start the backend server:- npm start
    Server runs on http://localhost:1111

6. Frontend Setup:-
    Navigate to the frontend directory: cd client
    Install Dependencies: npm install
    Start the frontend server: npm start
        Frontend runs on http://localhost:3000

7. Verify Setup:-
Open http://localhost:3000 in your browser.
Navigate to /items, /inventory, or /purchases to test the application.
Ensure backend APIs (http://localhost:1111/items/getItem, etc.) are responding.

API Endpoints :-

Items:
    POST /items/create: Create a new item
    GET /items/getItem: Get all items
    GET /items/getItemTypes: Get all item types
    PUT /items/:id: Update an item
    DELETE /items/:id: Delete an item

Inventory:
    POST /inventory/createInventory: Add inventory
    GET /inventory/getInventory: Get all inventory
    PUT /inventory/:id: Update inventory
    DELETE /inventory/:id: Delete inventory

Purchases:-
    POST /purchases/createPurchase: Create a purchase
    GET /purchases/getPurchase: Get all purchases
    PUT /purchases/:id: Update a purchase
    DELETE /purchases/:id: Delete a purchase
    PUT /purchases/details/:id: Update purchase detail
    DELETE /purchases/details/:id: Delete purchase detail

Usage:-
    Add Items: Go to /items, enter item details (name, price, type), and submit.
    Manage Inventory: Go to /inventory, add or update stock for items.
    Create Purchases: Go to /purchases, enter customer details and select items with quantities.
    View/Edit Details: Click the info icon on a purchase in the table to view or edit purchase details.


Troubleshooting:-
    Database Errors: Ensure MySQL is running and credentials in database.js are correct.
    API Errors: Check if backend server is running on http://localhost:1111.
    Frontend Issues: Verify api.js is correctly configured with baseURL: "http://localhost:1111".
    Console Errors: Check browser console or server logs for specific error messages.

Contributing:
    Fork the repository.
    Create a new branch (git checkout -b feature/your-feature).
    Commit changes (git commit -m "Add your feature").
    Push to the branch (git push origin feature/your-feature).
    Open a pull request.
