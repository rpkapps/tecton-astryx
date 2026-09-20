import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatLayout} from '../ChatLayout.js';
import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../../ChatMessageBubble/ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatTokenizedText} from '../../ChatTokenizedText/ChatTokenizedText.js';
import {VStack} from '../../VStack/VStack.js';

const TOKENS = [{value: '/review', label: '/review', variant: 'blue' as const}];

export function ChatLayoutShowcase() {
  return (
    <VStack width={450}>
      <ChatLayout
        composer={
          <ChatComposer onSubmit={() => {}} placeholder="Ask something..." />
        }
      >
        <ChatMessageList>
          <ChatMessage sender="user">
            <ChatMessageBubble>
              <ChatTokenizedText tokens={TOKENS}>
                /review the changes in this file
              </ChatTokenizedText>
            </ChatMessageBubble>
          </ChatMessage>
          <ChatMessage sender="assistant">
            <ChatMessageBubble variant="ghost">
              Reading the file now...
            </ChatMessageBubble>
          </ChatMessage>
        </ChatMessageList>
      </ChatLayout>
    </VStack>
  );
}
