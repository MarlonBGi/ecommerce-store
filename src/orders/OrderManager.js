/**
 * Gestor de pedidos para e-commerce
 * @author Marlon BGi
 */

class OrderManager {
    constructor() {
        this.orders = new Map();
        this.orderCounter = 1;
    }

    /**
     * Crear nuevo pedido
     * @param {Array} products - Lista de productos
     * @param {string} userId - ID del usuario
     * @param {Object} shippingInfo - Información de envío
     * @returns {Object} Pedido creado
     */
    createOrder(products, userId, shippingInfo) {
        // Validaciones básicas
        if (!products || products.length === 0) {
            throw new Error('El pedido debe tener al menos un producto');
        }
        
        if (!userId) {
            throw new Error('ID de usuario requerido');
        }

        const orderId = `ORD-${this.orderCounter++}`;
        const order = {
            id: orderId,
            userId: userId,
            products: products,
            shippingInfo: shippingInfo,
            status: 'pending',
            total: this.calculateTotal(products),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.orders.set(orderId, order);
        console.log(`✅ Pedido ${orderId} creado exitosamente`);
        return order;
    }

    /**
     * Actualizar estado del pedido
     * @param {string} orderId - ID del pedido
     * @param {string} status - Nuevo estado
     * @returns {Object|null} Pedido actualizado
     */
    updateOrderStatus(orderId, status) {
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            throw new Error(`Estado inválido: ${status}`);
        }

        const order = this.orders.get(orderId);
        if (!order) {
            console.log(`❌ Pedido ${orderId} no encontrado`);
            return null;
        }

        order.status = status;
        order.updatedAt = new Date();
        
        console.log(`📦 Pedido ${orderId} actualizado a: ${status}`);
        return order;
    }

    /**
     * Obtener pedidos por usuario
     * @param {string} userId - ID del usuario
     * @returns {Array} Lista de pedidos del usuario
     */
    getOrdersByUser(userId) {
        return Array.from(this.orders.values())
            .filter(order => order.userId === userId)
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    /**
     * Calcular total del pedido
     * @param {Array} products - Lista de productos
     * @returns {number} Total del pedido
     */
    calculateTotal(products) {
        return products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    }

    /**
     * Cancelar pedido
     * @param {string} orderId - ID del pedido
     * @returns {boolean} True si se canceló exitosamente
     */
    cancelOrder(orderId) {
        const order = this.orders.get(orderId);
        if (!order) {
            return false;
        }

        if (order.status === 'shipped' || order.status === 'delivered') {
            throw new Error('No se puede cancelar un pedido ya enviado');
        }

        return this.updateOrderStatus(orderId, 'cancelled') !== null;
    }
}

module.exports = OrderManager;
