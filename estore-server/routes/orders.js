const express = require("express");
const pool = require("../shared/pool");
const orders = express.Router();
const checkToken = require("../shared/checkToken");

orders.post("/add", checkToken, async (reg, res) => {
      const {
            userName,
            userEmail,
            address,
            city,
            state,
            pin,
            total,
            orderDetails,
      } = reg.body;

      try {
            const [users] = await pool
                  .promise()
                  .query("select id from users where email = ?", [userEmail]);

            if (users.length === 0) {
                  return res
                        .status(400)
                        .json({ message: "User does not exist" });
            }

            const userId = users[0].id;
            const [orderResult] = await pool
                  .promise()
                  .query(
                        `insert into orders (userId, userName, address, city, state, pin, total) values (?,?,?,?,?,?,?)`,
                        [userId, userName, address, city, state, pin, total],
                  );
            const orderId = orderResult.insertId;

            const insertPromises = orderDetails.map((item) =>
                  pool
                        .promise()
                        .query(
                              `insert into orderdetails (orderId, productId, qty, price, amount) values (?,?,?,?,?)`,
                              [
                                    orderId,
                                    item.productId,
                                    item.qty,
                                    item.price,
                                    item.amount,
                              ],
                        ),
            );
            await Promise.all(insertPromises);

            res.status(201).json({ message: "Order placed successfully" });
      } catch (error) {
            console.log("Order placement error: ", error);
            res.status(500).json({
                  error: error.code || "INTERNAL_ERROR",
                  message: error.message || "Something went wrong",
            });
      }
});

orders.get("/allorders", checkToken, async (req, res) => {
      const { userEmail } = req.body;
 
      try {
            const [users] = await pool
                  .promise()
                  .query(`Select id from users where email = ?`, [userEmail]);
            if (users.length === 0) {
                  return res.status(404).json({ message: "User not found" });
            }

            const userId = users[0].id;

            const [ordersData] = await pool
                  .promise()
                  .query(
                        `select orderId, DATE_FORMAT(orderDate,'%m/%d/%Y') as orderDate, userName, address, city, state, pin, total from orders where userId = ?`,
                        [userId],
                  );

            const allOrders = ordersData.map((order) => ({
                  orderId: order.orderId,
                  userName: order.userName,
                  address: order.address,
                  city: order.city,
                  state: order.state,
                  pin: order.pin,
                  total: order.total,
                  orderDate: order.orderDate,
            }));

            res.status(200).json(allOrders);
      } catch (error) {
            console.log("Error fetchig orders: ", error);
            res.status(500).json({
                  error: error.code || "INTERNAL_ERROR",
                  message: error.message || "Something went wrong",
            });
      }
});

orders.get("/orderproducts", checkToken, async (req, res) => {
      const { orderId } = req.body;
      try {
            const [orderProducts] = await pool
                  .promise()
                  .query(
                        `select od.productId, p.product_name, od.qty, od.price, od.amount from orderDetails od join products p on od.productId = p.id where od.orderId = ?`,
                        [orderId],
                  );
            const orderDetails = orderProducts.map((item) => ({
                  productId: item.productId,
                  productName: item.product_name,
                  qty: item.qty,
                  price: item.price,
                  amount: item.amount,
            }));

            res.status(200).json(orderDetails);
      } catch (error) {
            console.log("Error fetching order products: ", error);
            res.status(500).json({
                  error: error.code || "INTERNAL_ERROR",
                  message: error.message || "Something went wrong",
            });
      }
});

module.exports = orders;
