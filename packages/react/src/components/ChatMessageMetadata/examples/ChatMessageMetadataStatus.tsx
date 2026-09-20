import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../../ChatMessageBubble/ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatMessageMetadata} from '../ChatMessageMetadata.js';
import {Timestamp} from '../../Timestamp/Timestamp.js';

const STATUSES = [
  {status: 'sending' as const, text: 'Deploying the update now…'},
  {status: 'sent' as const, text: 'Config pushed to staging.'},
  {status: 'delivered' as const, text: 'Verified on the staging cluster.'},
  {status: 'read' as const, text: 'Looks good — promoting to prod.'},
  {status: 'error' as const, text: 'Rollback triggered, checking logs.'},
];

export function ChatMessageMetadataStatus() {
  return (
    <ChatMessageList style={{maxWidth: 400}}>
      {STATUSES.map(({status, text}) => (
        <ChatMessage key={status} sender="user">
          <ChatMessageBubble
            metadata={
              <ChatMessageMetadata
                timestamp={
                  <Timestamp value="2026-04-29T10:15:00" format="time" />
                }
                status={status}
              />
            }
          >
            {text}
          </ChatMessageBubble>
        </ChatMessage>
      ))}
    </ChatMessageList>
  );
}
