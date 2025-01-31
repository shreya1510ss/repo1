import React , {useState} from 'react';
import {Box, Text} from "@chakra-ui/layout";
import {Tooltip } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Input,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import {ChatState} from "../../context/chatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../chatLoading";
import UserListItem from '../UserAvatar/UserListItem';
import { Spinner } from "@chakra-ui/spinner";
import {getSender} from '../../config/chatLogics';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";


const SideDrawer = () => {

    const [search, setsearch] = useState("");
    const [searchResult, setsearchResult] = useState([]);
    const [loading, setloading] = useState(false)
    const [loadingChat, setloadingChat] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const history=useHistory();
      const toast = useToast();

    const {
      user,
      setSelectedChat,
      chats,
      setChats,
      notification,
      setnotification,
    } = ChatState();

    const LogoutHandler=()=>{
      localStorage.removeItem("userInfo");
       history.push("/");
      window.location.reload(); 
     
    }


    const handleSearch=async()=>{
       if(!search){
        toast({
          title: "Please Enter Something to Search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });

       }

       try {
        setloading(true) 

        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,
          },
        };

        const {data}= await axios.get(`/api/user?search=${search}`,config)

        setloading(false);
        setsearchResult(data);
        

        
       } catch (error) {
        toast({
          title: "Error Occured!",
          description:"Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });

        
       }


    }


    const accessChat=async(userId)=>{

      try {

        setloadingChat(true)
         const config = {
           headers: {
             "content-type":"application/json",
             Authorization: `Bearer ${user.token}`,

           },
         };


         const {data}= await axios.post('/api/chat',{userId},config);

         if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);


           setSelectedChat(data);
           setloadingChat(false);
           onClose();





        
      } catch (error) {

         toast({
           title: "Error Occured!",
           description: "Failed to Load the Search Results",
           status: "error",
           duration: 5000,
           isClosable: true,
           position: "bottom-left",
         });
        
      }

    }




  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          CHAT-WAVE
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />

              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setnotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {console.log("hello")}
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuDivider />
              <MenuItem onClick={LogoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">SEARCH USER</DrawerHeader>
          <DrawerBody>
            <Box display="flex " pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer