import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { createContext, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () =>
{
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) =>
{
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() =>
    {
        if (userInfo)
        {
            //For connection
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            })

            //When connection established
            socket.current.on("connect", () =>
            {
                console.log("Connected to socket server");
            })

            //On event occurs
            const handleRecieveMessage = (message) =>
            {
                const { selectedChatData, selectedChatType, addMessage, addContactsInDMContacts } = useAppStore.getState();

                if (selectedChatType !== undefined && (
                    selectedChatData._id === message.sender._id ||
                    selectedChatData._id === message.recipient._id))
                {
                    console.log("meesage recieved", message);
                    addMessage(message);
                }
                addContactsInDMContacts(message);
            }

            //On event occurs
            const handleRecieveChannelMessage = (message) =>
            {
                const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList } = useAppStore.getState();

                if (selectedChatType !== undefined &&
                    selectedChatData._id === message.channelId
                )
                {
                    console.log("meesage recieved", message);
                    addMessage(message);
                }
                addChannelInChannelList(message);
            }

            

            socket.current.on("recieveMessage", handleRecieveMessage);
            socket.current.on("recieve-channel-message", handleRecieveChannelMessage);

            return () =>
            {
                socket.current.disconnect();
            }
        }
    }, [userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}