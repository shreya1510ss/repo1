import React, { useState, useEffect } from "react";
import axios from "axios";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogics";
import { ChatState } from "../context/chatProvider";



const ScrollableChat = ({ messages}) => {
  const { user, toggle } = ChatState();
  const [translatedMessages, setTranslatedMessages] = useState([]);

  useEffect(() => {
    translateMessages();
  }, [messages, toggle]); // Trigger translation when messages or toggle state change

  const translateMessage = async (content,m) => {
    //  console.log("happening");

     console.log(m);
    
  
      try {
        const response = await axios.post("/translate", {
          q: content,
          source: m.sender.language,
          target: user.language,
        });

        console.log(response)
        return response.data;
      } catch (error) {
        console.error("Translation error:", error);
        return content; // Return original content if translation fails
      }

    
  };

 

  const translateMessages = async () => {
    const translated = await Promise.all(
      messages.map(async (m) => {
        if (toggle && m.sender._id !== user._id) {
          // Translate message if toggle is true and sender is not current user
          return {
            ...m,
            content: await translateMessage(m.content,m),
          };
        } else {
          return m; // Return original message if no translation needed
        }
      })
    );
    setTranslatedMessages(translated);
  };

  return (
    <ScrollableFeed>
      {translatedMessages &&
        translatedMessages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(translatedMessages, m, i, user._id) ||
              isLastMessage(translatedMessages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(
                  translatedMessages,
                  m,
                  i,
                  user._id
                ),
                marginTop: isSameUser(translatedMessages, m, i, user._id)
                  ? 3
                  : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
