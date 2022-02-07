//import DotEnv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import Connection from "./database/db.js";
import { getDocument, updateDocument } from "./controller/document-controller.js"
import { createServer } from "http";

const PORT=process.env.PORT || 9000;
const URL=process.env.MONGODB_URI || `mongodb://ritik:Ritik1311@google-docs-shard-00-00.5gffh.mongodb.net:27017,google-docs-shard-00-01.5gffh.mongodb.net:27017,google-docs-shard-00-02.5gffh.mongodb.net:27017/GOOGLE-DOCS?ssl=true&replicaSet=atlas-vzg4hz-shard-0&authSource=admin&retryWrites=true&w=majority`
  
Connection(URL);
//DotEnv.config();
const app = express();
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
}

const httpServer = createServer(app);
httpServer.listen(PORT);

const io=new Server(httpServer);

io.on('connection', socket => {
    socket.on('get-document', async documentId=>{
        
        const document= await getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document',document.data);
        socket.on('send-changes', delta =>{
            socket.broadcast.to(documentId).emit('receive-changes',delta);
        })
        socket.on('save-document', async data=>{
            await updateDocument(documentId,data);
        })
    }); 
});
