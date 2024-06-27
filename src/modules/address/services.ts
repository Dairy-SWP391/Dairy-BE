import { DatabaseInstance } from '~/database/database.services';
import { AddAddressReqBody, UpdateAddressReqBody } from './requests';

class AddressService {
  async addAddress(payload: AddAddressReqBody) {
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

  async updateAddress(payload: UpdateAddressReqBody) {
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
