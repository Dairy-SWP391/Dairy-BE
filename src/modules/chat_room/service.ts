import { DatabaseInstance } from '~/database/database.services';

class ChatRoomService {
  async getChatRoomByUserId(user_id: string) {
    const chatRoom = await DatabaseInstance.getPrismaInstance().chatRoom.findFirst({
      where: {
        member_id: user_id,
      },
    });
    if (chatRoom) return chatRoom.id;
    const newChatRoom = await DatabaseInstance.getPrismaInstance().chatRoom.create({
      data: {
        member_id: user_id,
        staff_id: 'staff001',
        updated_at: new Date(),
      },
    });

    return newChatRoom?.id;
  }

  async getAllChatRooms() {
    const chatRooms = await DatabaseInstance.getPrismaInstance().chatRoom.findMany({
      orderBy: {
        updated_at: 'desc',
      },
      select: {
        member: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        staff: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        ChatLine: {
          orderBy: {
            created_at: 'desc',
          },
          select: {
            content: true,
            created_at: true,
            sender: true,
          },
          take: 1,
        },
        created_at: true,
        updated_at: true,
        id: true,
      },
    });

    // const result: {
    //   id: number;
    //   member_id: string;
    //   staff_id: string;
    //   created_at: Date;
    //   updated_at: Date;
    //   newest_message: string;
    // }[] = [];

    // await Promise.all(
    //   chatRooms.map(async (chatRoom) => {
    //     const message = await DatabaseInstance.getPrismaInstance().chatLine.findFirst({
    //       where: {
    //         chat_room_id: chatRoom.id,
    //       },
    //       orderBy: {
    //         created_at: 'desc',
    //       },
    //     });
    //     result.push({ ...chatRoom, newest_message: message?.content as string });
    //   }),
    // );

    // const message = await DatabaseInstance.getPrismaInstance().chatLine.findFirst({
    //   where: {
    //     chat_room,
    //   },
    //   orderBy: {
    //     created_at: 'desc',
    //   },
    // });

    return chatRooms;
  }
}

const chatRoomService = new ChatRoomService();

export default chatRoomService;
