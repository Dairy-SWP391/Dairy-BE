import { DatabaseInstance } from '~/database/database.services';

class ChatLineService {
  async createChatLine({
    content,
    chat_room_id,
    sender,
  }: {
    content: string;
    chat_room_id: number;
    sender: 'STAFF' | 'MEMBER';
  }) {
    const chatLine = await DatabaseInstance.getPrismaInstance().chatLine.create({
      data: {
        content,
        chat_room_id,
        sender,
      },
      select: {
        id: true,
        content: true,
        sender: true,
        created_at: true,
      },
    });
    return chatLine;
  }

  async getChatByUserIds({
    chat_room_id,
    limit,
    page,
  }: {
    chat_room_id: number;
    limit: number;
    page: number;
  }) {
    const chatLines = await DatabaseInstance.getPrismaInstance().chatLine.findMany({
      where: {
        chat_room_id,
      },
      orderBy: {
        created_at: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        content: true,
        sender: true,
        created_at: true,
      },
    });
    const total = await DatabaseInstance.getPrismaInstance().chatLine.count();
    return {
      chatLines,
      total,
    };
  }
}

const chatLineService = new ChatLineService();

export default chatLineService;
