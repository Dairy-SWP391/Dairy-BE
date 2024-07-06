import { DatabaseInstance } from '~/database/database.services';
import { CartListType } from '../order/schema';
import { CartListItem } from '../order/requests';

class OrderDetailService {
  async createOrderDetail(cartList: CartListType, order_id: number) {
    await DatabaseInstance.getPrismaInstance().orderDetail.createMany({
      data: cartList.cart_list.map((item) => {
        return {
          order_id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          sale_price: item.sale_price || item.price,
        };
      }),
    });
  }

  async getOrderDetail(order_id: number): Promise<CartListItem[]> {
    const orderDetails = await DatabaseInstance.getPrismaInstance().orderDetail.findMany({
      where: {
        order_id,
      },
      select: {
        product_id: true,
        quantity: true,
      },
    });
    return orderDetails.map((item) => {
      return {
        product_id: item.product_id.toString(),
        quantity: item.quantity.toString(),
      };
    });
  }
}

const orderDetailService = new OrderDetailService();

export default orderDetailService;
