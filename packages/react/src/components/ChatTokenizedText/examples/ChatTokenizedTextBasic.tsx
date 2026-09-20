import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../../ChatMessageBubble/ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatTokenizedText} from '../ChatTokenizedText.js';

const tokens = [
  {value: '@cindy', label: '@Cindy', variant: 'blue' as const},
  {value: '@alex', label: '@Alex', variant: 'blue' as const},
];

export function ChatTokenizedTextBasic() {
  return (
    <ChatMessageList>
      <ChatMessage sender="system">
        <ChatMessageBubble>
          <ChatTokenizedText tokens={tokens}>
            Assign @cindy and @alex as reviewers.
          </ChatTokenizedText>
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  );
}
