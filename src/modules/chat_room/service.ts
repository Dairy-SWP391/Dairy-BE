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
      },
    });

    return newChatRoom?.id;
  }
}

const chatRoomService = new ChatRoomService();

export default chatRoomService;
