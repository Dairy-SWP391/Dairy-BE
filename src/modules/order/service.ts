// import axios from 'axios';
import { config } from 'dotenv';
// import { ErrorWithStatus } from '../error/entityError';
// import HTTP_STATUS from '~/constants/httpsStatus';
// import { ORDER_MESSAGES } from './messages';
import { CartListItem } from './requests';
import { DatabaseInstance } from '~/database/database.services';
import { ErrorWithStatus } from '../error/entityError';
import { ORDER_MESSAGES } from './messages';
import HTTP_STATUS from '~/constants/httpsStatus';
import { CartListType } from './schema';
import { GetFeeType } from '../ship/schema';

config();

class OrderService {
  async convertCartList(cart_list: CartListItem[]): Promise<CartListType> {
    // danh sách các product_id mà người dùng đã truyền lên trong cart_list
    const productCartIdListPrev = cart_list.reduce((result: number[], item) => {
      result.push(Number(item.product_id));
      return result;
    }, []);

    // danh sách các product lấy từ productCartIdListPrev
    const productList = await DatabaseInstance.getPrismaInstance().product.findMany({
      select: {
        id: true,
        name: true,
        quantity: true,
        ship_category_id: true,
        volume: true,
        weight: true,
      },
      where: {
        id: {
          in: productCartIdListPrev,
        },
      },
    });

    // lấy danh sách product_id từ danh sách lấy đc
    const productCartIdList = productList.reduce((result: number[], item) => {
      result.push(Number(item.id));
      return result;
    }, []);

    // danh sách những product_id không có trong table product đã lấy đc
    const productIdListInValid = productCartIdListPrev.filter((item) => {
      return !productCartIdList.includes(item);
    });

    // nếu danh sách này có phần tử nghĩa là cart_list người dùng truyền lên có product_id không hợp lệ
    if (productIdListInValid.length) {
      throw new ErrorWithStatus({
        message: ORDER_MESSAGES.PRODUCT_ID_IS_INVALID, // có sản phẩm không tồn tại
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      });
    }
    // lấy price cho từng sản phẩm
    let productPriceList = await DatabaseInstance.getPrismaInstance().productPricing.findMany({
      where: {
        product_id: {
          in: productCartIdListPrev,
        },
      },
    });

    // bỏ những đứa hết hạng
    productPriceList = productPriceList.filter((item) => {
      const isDated = item.ending_timestamp && item.ending_timestamp < new Date();
      return !isDated;
    });

    // bỏ những đứa null nếu chúng đã có giảm giá(nếu đã có giảm giá thì chắc chắn còn 2 thằng)
    // productPriceList = productPriceList.filter((item) => {
    //   const groupProduct = productPriceList.filter((_item) => _item.product_id == item.product_id);
    //   if (groupProduct.length == 2 && item.ending_timestamp == null) {
    //     return false;
    //   }
    //   return true;
    // });

    // check Quatity
    const result = [] as {
      id: number;
      name: string;
      quantity: number;
      price: number;
      sale_price: number;
      ship_category_id: string;
      volume: number | null;
      weight: number;
    }[];
    let allQuality = 0;
    productList.forEach((product) => {
      const prevProduct = cart_list.find((item) => Number(item.product_id) == product.id);
      if (product.quantity < Number(prevProduct?.quantity)) {
        throw new ErrorWithStatus({
          message: ORDER_MESSAGES.QUANTITY_IN_STOCK_IS_NOT_ENOUGH,
          status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        });
      }
      // lấy giá tiền, volume,  weight của từng sản phẩm
      const price = Number(
        productPriceList.find(
          (item) => item.product_id === product.id && item.ending_timestamp === null,
        )?.price,
      );
      const sale_price = Number(
        productPriceList.find(
          (item) => item.product_id === product.id && item.ending_timestamp !== null,
        )?.price,
      );
      const productInfor = productList.find((item) => item.id === product.id);
      const volume = productInfor?.volume ? Number(productInfor?.volume) : 10;
      const weight = productInfor?.weight ? Number(productInfor?.weight) : 10;
      allQuality += Number(prevProduct?.quantity);
      result.push({
        ...product,
        price,
        sale_price,
        quantity: Number(prevProduct?.quantity),
        volume: volume,
        weight: weight,
      });
    });

    // tính tổng tiền
    let totalMoney = 0;
    result.forEach((item) => {
      item.sale_price
        ? (totalMoney += item.sale_price * item.quantity)
        : (totalMoney += item.price * item.quantity);
    });
    return {
      cart_list: result,
      allQuality,
      totalMoney,
    };
  }

  async createOrder({
    user_id,
    receiver_name,
    phone_number,
    address,
    cartList,
    fee,
  }: {
    user_id: string;
    receiver_name: string;
    phone_number: string;
    address: string;
    cartList: CartListType;
    fee: GetFeeType;
  }) {
    const order = await DatabaseInstance.getPrismaInstance().order.create({
      data: {
        user_id,
        receiver_name,
        phone_number,
        address,
        estimate_price: cartList.totalMoney,
        end_price: cartList.totalMoney + fee.total - 0,
        ship_fee: fee.total,
        discount: 0,
        status: 'PENDING',
      },
    });
    await DatabaseInstance.getPrismaInstance().orderDetail.createMany({
      data: cartList.cart_list.map((item) => {
        console.log('item', item);
        return {
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          sale_price: item.sale_price || item.price,
        };
      }),
    });
    return order.id;
  }

  async finishOrderPayment(order_id: string) {
    await DatabaseInstance.getPrismaInstance().order.update({
      where: {
        id: Number(order_id),
      },
      data: {
        status: 'SUCCESS',
      },
    });
  }
}

const orderService = new OrderService();
export default orderService;
