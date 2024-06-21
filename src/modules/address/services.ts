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
    return addresses.map((address) => {
      return {
        id: address.id,
        name: address.name,
        phone: address.phone_number,
        address: address.address,
        default_address: address.default_address,
      };
    });
  }

  async updateAddress(payload: UpdateAddressReqBody) {
    const address = await DatabaseInstance.getPrismaInstance().address.update({
      where: {
        id: payload.id,
      },
      data: {
        name: payload.name,
        phone_number: payload.phone_number,
        address: payload.address,
        default_address: payload.default_address,
      },
    });
    return address;
  }
}
const addressService = new AddressService();
export default addressService;
