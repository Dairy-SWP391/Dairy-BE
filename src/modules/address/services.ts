import { DatabaseInstance } from '~/database/database.services';
import { AddAddressReqBody } from './requests';

class AddressService {
  async addAddress(payload: AddAddressReqBody) {
    const address = await DatabaseInstance.getPrismaInstance().address.create({
      data: {
        ...payload,
      },
    });
    return address;
  }
}
const addressService = new AddressService();
export default addressService;
