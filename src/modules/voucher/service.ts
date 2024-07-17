import { DatabaseInstance } from '~/database/database.services';
import { AddVoucherReqBody, UpdateVoucherReqBody } from './requests';
import { $Enums } from '@prisma/client';

class VoucherService {
  async addVoucher(voucher: AddVoucherReqBody) {
    let code = voucher.code;

    if (!code) {
      const newest_voucher = await DatabaseInstance.getPrismaInstance().voucher.findFirst({
        orderBy: {
          created_at: 'desc',
        },
        select: {
          id: true,
        },
      });

      let id = (newest_voucher ? newest_voucher.id + 1 : 1).toString();

      while (id.length < 4) {
        id = '0' + id;
      }

      code = `VOU${id}`;
    }

    const result = await DatabaseInstance.getPrismaInstance().voucher.create({
      data: {
        ...voucher,
        code: voucher.code ? voucher.code : code,
        quantity: Number(voucher.quantity),
      },
    });

    return result;
  }

  async getAllVoucher({
    role,
    limit,
    page,
    status,
  }: {
    role: $Enums.ROLE;
    limit: string;
    page: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }) {
    if (role === 'ADMIN' || role === 'STAFF') {
      const vouchers = await DatabaseInstance.getPrismaInstance().voucher.findMany({
        where: {
          status: status ? status : undefined,
        },
      });
      return {
        total: vouchers.length,
        total_page: Math.ceil(vouchers.length / Number(limit)),
        page,
        limit,
        items: vouchers.slice(
          (Number(page) - 1) * Number(limit),
          (Number(page) - 1) * Number(limit) + Number(limit),
        ),
      };
    } else {
      const vouchers = await DatabaseInstance.getPrismaInstance().voucher.findMany({
        where: {
          status: 'ACTIVE',
          expired_at: {
            // gte: new Date(),
          },
        },
      });
      return {
        total: vouchers.length,
        total_page: Math.ceil(vouchers.length / Number(limit)),
        page,
        limit,
        items: vouchers.slice(
          (Number(page) - 1) * Number(limit),
          (Number(page) - 1) * Number(limit) + Number(limit),
        ),
      };
    }
  }

  async getVoucherByCode(code: string) {
    const voucher = await DatabaseInstance.getPrismaInstance().voucher.findUnique({
      where: {
        code,
      },
    });

    return voucher;
  }

  async updateVoucher({
    expired_at,
    id,
    quantity,
    status,
    trading_point,
    value,
  }: UpdateVoucherReqBody) {
    const result = await DatabaseInstance.getPrismaInstance().voucher.update({
      where: {
        id,
      },
      data: {
        expired_at,
        quantity,
        status,
        trading_point,
        value,
      },
    });

    return result;
  }
}

const voucherService = new VoucherService();

export default voucherService;
