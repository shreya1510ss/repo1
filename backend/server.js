const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const path=require('path');



const app = express();
app.use(express.json()); //To accept JSON data

dotenv.config();

connectDB();

// app.get("/", (req, res) => res.send("API is running successfully shreya"));

//  app.get('/api/chat',(req,res)=>{
//     res.send(chats)
//  })

//  app.get('/api/chat/:id', (req,res)=>{
//     // console.log(req.params.id);
//     const singleChat=chats.find((c)=>c._id==req.params.id);
//     res.send(singleChat);

//  })

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use("/translate", async (req, res) => {
  const { q, source, target } = req.body;

   let url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${source}|${target}`;

   fetch(url)
     .then((res) => res.json())
     .then((data) => {
       res.json(data.responseData.translatedText)
    
     });

  
});

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const chalk = require("chalk");

const server=app.listen(PORT, () => {
  console.log(chalk.yellow.bold(`Server started on Port ${PORT}`));
});


const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
    },
});

io.on("connection",(socket)=>{
    console.log(`connected to socket io:`);

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    });


    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log("user joined room"+ room);
    });

   socket.on("typing", (room) => socket.in(room).emit("typing"));
   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    

    socket.on("new message",(newMessageRecieved)=>{
        var chat=newMessageRecieved.chat;
        if(!chat.users) return  console.log("chat.users not defined");


        chat.users.forEach(user=>{
            if(user._id===newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);

        });


        socket.off("setup", () => {
          console.log("USER DISCONNECTED");
          socket.leave(userData._id);
        });


        




    });






})


