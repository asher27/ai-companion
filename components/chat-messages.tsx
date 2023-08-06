'use client';

import { Companion, Message } from '@prisma/client';
import ChatMessage, { ChatMessageProps } from '@/components/chat-message';
import { ElementRef, useEffect, useRef, useState } from 'react';


interface ChatMessagesProps {
  isLoading: boolean;
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
  messages: ChatMessageProps[];
}

const ChatMessages = ({ isLoading, companion, messages = [] }: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<'div'>>(null);
  const [fakeLoading, setFakeLoading] = useState(messages.length === 0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className={'flex-1 overflow-y-auto pr-4'}>
      <ChatMessage
        isLoading={fakeLoading}
        role={'system'}
        content={`Hello, I am ${companion.name}, ${companion.description}`}
        src={companion.src}
      />
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          role={message.role}
          content={message.content}
          src={companion.src}
        />
      ))}
      {isLoading && <ChatMessage role={'system'} src={companion.src} isLoading />}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatMessages;
