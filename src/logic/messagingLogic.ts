/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { MessageThread } from "../types";
import { store } from "./explorerStore";

export function useMessagingController() {
  const [activeChannel, setActiveChannel] = useState<"slack" | "whatsapp">("slack");
  const [selectedContact, setSelectedContact] = useState<string>("");
  const [typedMessage, setTypedMessage] = useState("");

  const threads = store.getState().messages;

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => t.channel === activeChannel);
  }, [activeChannel, threads]);

  const activeThread = useMemo(() => {
    const defaultThread = filteredThreads[0] || null;
    if (!selectedContact) {
      return defaultThread;
    }
    return filteredThreads.find((t) => t.contact === selectedContact) || defaultThread;
  }, [selectedContact, filteredThreads]);

  const handleSend = () => {
    if (!typedMessage.trim() || !activeThread) return;
    const channel = activeThread.channel;
    const contact = activeThread.contact;
    const msgText = typedMessage;

    store.sendChat(channel, contact, msgText);
    setTypedMessage("");

    // Setup simulated back-and-forth auto-reply callback
    setTimeout(() => {
      const responses = [
        "That sounds perfect, I am testing the live environment!",
        "Yes, got your update in my workspace bubble.",
        "Understood, let's stay synced on Explorer.",
        "Alright, sounds good to me!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const thread = store.getState().messages.find(
        (m) => m.channel === channel && m.contact === contact
      );
      if (thread) {
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        thread.chats.push({
          sender: contact,
          text: randomResponse,
          time: timeStr,
        });
        
        // Notify the store to save and update notifications
        // Let's add a notification alert
        const msgBubble = store.getState().apps.find((a) => a.id === "messaging");
        if (msgBubble) msgBubble.notifications += 1;
        
        // Save store state
        localStorage.setItem("explorer_state", JSON.stringify(store.getState()));
        // Call save to notify listeners
        (store as any).save();
      }
    }, 1200);
  };

  return {
    activeChannel,
    setActiveChannel,
    selectedContact,
    setSelectedContact: (contact: string) => setSelectedContact(contact),
    activeThread,
    typedMessage,
    setTypedMessage,
    handleSend,
  };
}
