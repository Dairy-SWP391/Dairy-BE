import { DatabaseInstance } from '~/database/database.services';

class AddressService {
  async addAddress(payload: {
    name: string;
    phone_number: string;
    address: string;
    default_address: boolean;
    user_id: string;
    district_id: number;
    province_id: number;
    ward_code: number;
  }) {
    const address = await DatabaseInstance.getPrismaInstance().address.create({
      data: {
        ...payload,
      },
    });
    return address;
  }

  async getAllAddresses(user_id: string) {
    const addresses = await DatabaseInstance.getPrismaInstance().address.findMany({
      where: {
        user_id: user_id,
      },
    });
    return addresses.map((item) => {
      const {
        id,
        name,
        phone_number,
        address,
        default_address,
        province_id,
        district_id,
        ward_code,
      } = item;
      return {
        id,
        name,
        phone_number,
        address,
        default_address,
        province_id,
        district_id,
        ward_code,
      };
    });
  }

  async getDefaultAddress(user_id: string) {
    const address = await DatabaseInstance.getPrismaInstance().address.findFirst({
      where: {
        user_id,
        default_address: true,
      },
      select: {
        id: true,
        name: true,
        phone_number: true,
        address: true,
        default_address: true,
        province_id: true,
        district_id: true,
        ward_code: true,
      },
    });
    return address;
  }

  async updateAddress(payload: {
    id: number;
    name: string;
    phone_number: string;
    address: string;
    default_address: boolean;
    district_id: number;
    province_id: number;
    ward_code: number;
  }) {
    const {
      id,
      name,
      phone_number,
      address,
      default_address,
      province_id,
      district_id,
      ward_code,
    } = payload;
    const item = await DatabaseInstance.getPrismaInstance().address.update({
      where: {
        id,
      },
      data: {
        name,
        phone_number,
        address,
        default_address,
        province_id,
        district_id,
        ward_code,
      },
    });
    return item;
  }
}
const addressService = new AddressService();
export default addressService;
