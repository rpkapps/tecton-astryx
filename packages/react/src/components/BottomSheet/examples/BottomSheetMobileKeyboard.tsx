import {useState} from 'react';
import {BottomSheet} from '../BottomSheet.js';
import {Button} from '../../Button/Button.js';
import {Divider} from '../../Divider/Divider.js';
import {Heading} from '../../Heading/Heading.js';
import {Text} from '../../Text/Text.js';
import {TextArea} from '../../TextArea/TextArea.js';
import {TextField} from '../../TextField/TextField.js';
import {VStack} from '../../VStack/VStack.js';

interface ProfileFormValues {
  name: string;
  email: string;
  company: string;
  role: string;
  bio: string;
  notes: string;
}

const initialValues: ProfileFormValues = {
  name: '',
  email: '',
  company: '',
  role: '',
  bio: '',
  notes: '',
};

export function BottomSheetMobileKeyboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const update =
    (field: keyof ProfileFormValues) =>
    (value: string): void =>
      setValues(current => ({...current, [field]: value}));

  return (
    <>
      <Button label="Edit profile" onClick={() => setIsOpen(true)} />
      <BottomSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        label="Edit profile"
        height="tall"
      >
        <form
          onSubmit={event => {
            event.preventDefault();
            setIsOpen(false);
          }}
        >
          <VStack gap={4}>
            <Heading level={3}>Edit profile</Heading>
            <Divider />
            <Text variant="small" color="secondary">
              Focus fields throughout the form to see them remain visible above
              the mobile keyboard.
            </Text>
            <TextField
              label="Name"
              value={values.name}
              onChange={update('name')}
            />
            <TextField
              label="Email"
              type="email"
              value={values.email}
              onChange={update('email')}
            />
            <TextField
              label="Company"
              value={values.company}
              onChange={update('company')}
            />
            <TextField
              label="Role"
              value={values.role}
              onChange={update('role')}
            />
            <TextArea
              label="Bio"
              rows={5}
              value={values.bio}
              onChange={update('bio')}
            />
            <TextArea
              label="Notes"
              rows={5}
              value={values.notes}
              onChange={update('notes')}
            />
            <Button label="Save profile" type="submit" />
          </VStack>
        </form>
      </BottomSheet>
    </>
  );
}
