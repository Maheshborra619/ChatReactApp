import React,{ useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';


import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

let socket;



const Chat = ({ location }) =>{
    const [name , setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const endPoint = 'localhost:5000';

    useEffect(()=>{
        const { name , room }  = queryString.parse(location.search);

        socket = io(endPoint);

     setName(name);
     setRoom(room);
 
     socket.emit('join',{ name , room},(error)=>{
        if(error) {
            alert(error);
          }
     })
    },[endPoint, location.search]);

    

    useEffect(()=>{
        socket.on('message',(message)=>{
                setMessages([...messages, message]);
    });

    return ()=>{
        socket.emit('disconnect');

        socket.off();
    }
   },[messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message,()=> setMessage(''));
        }
    }

    //function for sending messages

    console.log(message,messages);

    
return (
   <div className="outerContainer">
       <div className="container">

           <InfoBar room = {room}/>
        {/* <input value={message}
         onChange={(event) => setMessage(event.target.value)}
         onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}  
         /> */}
          <Messages messages={messages} name={name} />
         <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
       </div>
   </div>
)
}

export default Chat;