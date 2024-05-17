import { Box } from "@chakra-ui/layout"; 
 import SingleChat from "./SingleChat";
import { ChatState } from "../context/chatProvider";

const Chatbox = ({ fetchAgain, setfetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
    </Box>
  );
};

export default Chatbox;
