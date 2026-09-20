import {ChatComposer} from '../ChatComposer.js';
import {ChatComposerDrawer} from '../../ChatComposerDrawer/ChatComposerDrawer.js';
import {Chip} from '../../Chip/Chip.js';
import {Stack} from '../../Stack/Stack.js';

export function ChatComposerAttachments() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={value => {
          console.log('Sent:', value);
        }}
        drawer={
          <ChatComposerDrawer count={6}>
            <Chip label="feature-prd.docx" onRemove={() => {}} />
            <Chip label="2026-roadmap.pdf" onRemove={() => {}} />
            <Chip label="user-flow.fig" onRemove={() => {}} />
            <Chip label="launch-plan.docx" onRemove={() => {}} />
            <Chip label="user-feedback.csv" onRemove={() => {}} />
            <Chip label="analytics-kpis.csv" onRemove={() => {}} />
          </ChatComposerDrawer>
        }
      />
    </Stack>
  );
}
