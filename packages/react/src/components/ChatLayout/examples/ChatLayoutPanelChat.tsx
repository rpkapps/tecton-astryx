import type {CSSProperties} from 'react';
import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatLayout} from '../ChatLayout.js';
import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../../ChatMessageBubble/ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatSystemMessage} from '../../ChatSystemMessage/ChatSystemMessage.js';
import {Markdown} from '../../Markdown/Markdown.js';

const panel: CSSProperties = {
  width: 450,
  height: 600,
  borderRadius: 8,
  overflow: 'hidden',
  border: '1px solid var(--color-border)',
};

export function ChatLayoutPanelChat() {
  return (
    <div style={panel}>
      <ChatLayout
        composer={
          <ChatComposer onSubmit={() => {}} placeholder="Ask something..." />
        }
      >
        <ChatMessageList>
          <ChatSystemMessage variant="divider">Today</ChatSystemMessage>

          <ChatMessage sender="user">
            <ChatMessageBubble>
              Can you review the Button component and fix the focus ring?
            </ChatMessageBubble>
          </ChatMessage>

          <ChatMessage sender="assistant">
            <Markdown density="compact">{`I'll check the Button component now.

Found the issue — the border radius was hardcoded. Replaced with the theme token.`}</Markdown>
          </ChatMessage>

          <ChatMessage sender="user">
            <ChatMessageBubble>
              Nice, can you also check the Card component?
            </ChatMessageBubble>
          </ChatMessage>

          <ChatMessage sender="assistant">
            <Markdown density="compact">{`Checking the component now.

Found the issue — the border radius was hardcoded. Replaced with the theme token.`}</Markdown>
          </ChatMessage>
        </ChatMessageList>
      </ChatLayout>
    </div>
  );
}
