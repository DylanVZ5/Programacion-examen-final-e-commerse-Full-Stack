const Order = require('../models/Order');

exports.getOrders = async (req, res) => {
  try {
    const filter = req.user.rol === 'admin' ? {} : { usuario: req.user.id };
    const orders = await Order.find(filter).populate('usuario', 'nombre email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { total } = req.body;
    const order = new Order({
      usuario: req.user.id,
      total,
      estado: 'pendiente'
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pedido', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { estado } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { estado }, { new: true });
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el pedido', error: error.message });
  }
};