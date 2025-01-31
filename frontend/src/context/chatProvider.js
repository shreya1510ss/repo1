import {createContext, useContext,useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';

const  ChatContext=createContext();

const ChatProvider=({children})=>{

    const [user, setuser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setnotification] = useState([]);
    const [toggle, settoggle] = useState(false);
     const history = useHistory();


    useEffect(() => {
       const userInfo= JSON.parse(localStorage.getItem("userInfo"));
      
       setuser(userInfo);
       console.log(userInfo)


      

       if(!userInfo)
        {
            history.push('/')
        }
    
    }, [history]);
    
   
    
    return (
      <ChatContext.Provider
        value={{
          user,
          setuser,
          selectedChat,
          setSelectedChat,
          chats,
          setChats,
          notification,
          setnotification,
          toggle,
          settoggle,
        }}
      >
        {children}
      </ChatContext.Provider>
    );

}

export const ChatState=()=>{
return useContext(ChatContext);
};


export default ChatProvider;
