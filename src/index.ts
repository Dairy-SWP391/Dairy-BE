import cors from 'cors';
import { config } from 'dotenv';
import express, { json } from 'express';
import { defaultErrorHandler } from './modules/error/middlewares';
import userRouter from './modules/user/routes';
import categoryRouter from './modules/category/routes';
import productRouter from './modules/product/routes';
import shipRouter from './modules/ship/routes';
import postRouter from './modules/post/routes';
import imageRouter from './modules/image/routes';
import cartRouter from './modules/cart/routes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatRoomService from './modules/chat_room/service';
import userService from './modules/user/service';
import chatLineService from './modules/chat_line/service';
import chatRoomRouter from './modules/chat_room/routes';

config();

// env
// const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: ['https://oyster-app-kl49u.ondigitalocean.app', 'http://localhost:3000'],
  credentials: true, // access-control-allow-credentials:true
  allowedHeaders: ['Content-Type', 'Authorization'], // access-control-allow-headers
  optionSuccessStatus: 200,
};

export const app = express();
export const httpServer = createServer(app);

const PORT_SERVER = process.env.PORT_SERVER ?? 4000;
app.use(cors(corsOptions));
app.use(json());

export const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const users: {
  [key: string]: {
    socket_id: string;
    role: 'STAFF' | 'MEMBER' | 'ADMIN';
  };
} = {};

io.on('connection', async (socket) => {
  console.log(`new client has id: ${socket.id} is connected`);

  const user_id = socket.handshake.auth._id as string;
  if (!user_id) return;
  const user = await userService.getUserRole(user_id);

  users[user_id] = {
    socket_id: socket.id,
    role: user?.role ?? 'MEMBER',
  };
  console.log(users);

  // thêm phần lắng nghe sự kiện nhắn tin riêng
  socket.on('send_message', async (data) => {
    // vào users.user_id.socket_id để lấy đc socket_id của người nhận
    const { payload } = data;
    const receiver_socket_id = users[payload.receiver_id]?.socket_id;
    if (!receiver_socket_id) return;
    const chat_room_id = await chatRoomService.getChatRoomByUserId(
      payload.sender === 'MEMBER' ? payload.sender_id : payload.receiver_id,
    );
    const conversation = await chatLineService.createChatLine({
      chat_room_id,
      content: payload.content,
      sender: user?.role as 'STAFF' | 'MEMBER',
    });
    // gửi tin nhắn đến người nhận gồm {nội dùng và người gữi}
    socket.to(receiver_socket_id).emit('receive_message', {
      payload: conversation,
    });
  });

  socket.on('disconnect', () => {
    delete users[user_id];
    console.log(`client has id: ${socket.id} is disconnected`);
    console.log(users);
  });
});

// middleware
// this is for logging
// app.all('*', (req, res, next) => {
//   console.log('Time', Date.now());
//   console.log(req);
//   next();
// });

// route
app.get('/', (req, res) => {
  res.send('This is home page');
});

app.use('/user', userRouter);

app.use('/category', categoryRouter);

app.use('/product', productRouter);

app.use('/ship', shipRouter);

app.use('/image', imageRouter);

app.use('/post', postRouter);

app.use('/cart', cartRouter);

app.use('/conversations', chatRoomRouter);

// error handler
app.use(defaultErrorHandler);

// port
httpServer.listen(PORT_SERVER, () => {
  console.log(`Server is running on http://localhost:${PORT_SERVER}`);
});
