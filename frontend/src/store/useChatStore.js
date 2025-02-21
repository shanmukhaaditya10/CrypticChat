import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import nacl from "tweetnacl";

import { base64ToUint8Array } from "../lib/utils";

function decryptMessage(
  encrypted,
  nonce,
  senderPublicKey,
  receiverSecretKey
) {
 try{
   const decrypted = nacl.box.open(
    encrypted,
    nonce,
    senderPublicKey,
    receiverSecretKey
  );

  if (!decrypted) throw new Error("Decryption failed!");
  const decoder = new TextDecoder();
  const utf8String = decoder.decode(decrypted);
  return utf8String;}
  catch(error){
    return `👾ERROR WHILE DECRYPTING👾`
  
  }
  }
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
  
    
      const {authUser} = useAuthStore.getState();
      const { selectedUser, messages } = get();
     
     
      const publicKey = base64ToUint8Array(selectedUser.publicKey)
      const pvtKey = base64ToUint8Array(localStorage.getItem(`secretKey-${authUser.email}`));
     
      
    
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      const decryptedMessages = res.data.map((msg) => ({
        ...msg,
        text: decryptMessage(
          base64ToUint8Array(msg.text),
          base64ToUint8Array(msg.nonce),
          publicKey,
          pvtKey
        ),
      }));
  
      set({ messages: decryptedMessages });

   
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
  
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    const publicKey = base64ToUint8Array(selectedUser.publicKey)
    const pvtKey = base64ToUint8Array(localStorage.getItem(`secretKey-${authUser.email}`));
    try {
     
      
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      const decryptedMessage = decryptMessage(
        base64ToUint8Array(res.data.text),
        base64ToUint8Array(res.data.nonce),
        publicKey,
        pvtKey
      )
      set({
        messages: [...messages, { ...res.data, text: decryptedMessage }]
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    
    const { authUser } = useAuthStore.getState();
    // const publicKey = base64ToUint8Array(selectedUser.publicKey)
    const pvtKey = base64ToUint8Array(localStorage.getItem(`secretKey-${authUser.email}`));
 
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
       
        const decryptedMessage = decryptMessage(
          base64ToUint8Array(newMessage.text),
          base64ToUint8Array(newMessage.nonce),
          base64ToUint8Array(newMessage.senderPublicKey),
          pvtKey
        );
        
        if (!decryptedMessage) {
          console.error("Decryption failed! Possibly wrong keys.");
        } else {
          console.log("Decrypted message:", decryptedMessage);
        }
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, { ...newMessage, text: decryptedMessage }],
      });
      
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
