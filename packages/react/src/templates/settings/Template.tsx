import {useState} from 'react';
import {Autocomplete} from '../../components/Autocomplete/Autocomplete.js';
import {Button} from '../../components/Button/Button.js';
import {Checkbox} from '../../components/Checkbox/Checkbox.js';
import {Divider} from '../../components/Divider/Divider.js';
import {Grid} from '../../components/Grid/Grid.js';
import {HStack} from '../../components/HStack/HStack.js';
import {Heading} from '../../components/Heading/Heading.js';
import {Layout} from '../../components/Layout/Layout.js';
import {LayoutContent} from '../../components/LayoutContent/LayoutContent.js';
import {LayoutHeader} from '../../components/LayoutHeader/LayoutHeader.js';
import {LayoutPanel} from '../../components/LayoutPanel/LayoutPanel.js';
import {List} from '../../components/List/List.js';
import {ListItem} from '../../components/ListItem/ListItem.js';
import {StackItem} from '../../components/StackItem/StackItem.js';
import {Tab} from '../../components/Tab/Tab.js';
import {Tabs} from '../../components/Tabs/Tabs.js';
import {Text} from '../../components/Text/Text.js';
import {TextField} from '../../components/TextField/TextField.js';
import {VStack} from '../../components/VStack/VStack.js';
import {useMediaQuery} from '../../support/index.js';
import type {AutocompleteSearchable as SearchableItem} from '../../support/index.js';

const NAV_ITEMS = [
  'Profile',
  'Account',
  'Members',
  'Billing',
  'Invoices',
  'API',
];

export function Template() {
  const isNarrow = useMediaQuery('(max-width: 768px)');
  const [activeNav, setActiveNav] = useState('Profile');
  const [username, setUsername] = useState('nicol43');
  const [firstName, setFirstName] = useState('Stephanie');
  const [lastName, setLastName] = useState('Nicol');
  const [email, setEmail] = useState('stephanie_nicol@mail.com');
  const [currentPw, setCurrentPw] = useState('password123');
  const [newPw, setNewPw] = useState('password123');
  const [confirmPw, setConfirmPw] = useState('password123');
  const [dataExport, setDataExport] = useState(false);
  const [adminMembers, setAdminMembers] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [searchValue, setSearchValue] = useState<SearchableItem | null>(null);

  return (
    <Layout
      height="fill"
      contentWidth={1440}
      header={
        <LayoutHeader hasDivider>
          <HStack>
            <StackItem size="fill">
              <Heading level={1}>Settings</Heading>
            </StackItem>
            <Autocomplete
              label="Search"
              isLabelHidden
              placeholder="Search settings..."
              value={searchValue}
              onChange={setSearchValue}
              startIcon="search"
            />
          </HStack>
        </LayoutHeader>
      }
      start={
        isNarrow ? undefined : (
          <LayoutPanel hasDivider={false} width={260} padding={2}>
            <List density="default">
              {NAV_ITEMS.map(item => (
                <ListItem
                  key={item}
                  label={item}
                  isSelected={activeNav === item}
                  onClick={() => setActiveNav(item)}
                />
              ))}
            </List>
          </LayoutPanel>
        )
      }
      content={
        <LayoutContent padding={4}>
          <VStack gap={4}>
            {/* Mobile: the sidebar nav collapses to a horizontal, centered
                tab bar above the content. */}
            {isNarrow && (
              <VStack>
                <Tabs value={activeNav} onChange={setActiveNav}>
                  {NAV_ITEMS.map(item => (
                    <Tab key={item} value={item} label={item} />
                  ))}
                </Tabs>
              </VStack>
            )}
            <Grid columns={{minWidth: 320}} gap={10}>
              <VStack gap={1}>
                <Heading level={3}>Basic information</Heading>
                <Text variant="small" color="secondary">
                  View and update your personal details and account information.
                </Text>
              </VStack>
              <VStack gap={4}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={setUsername}
                />
                <TextField
                  label="First name"
                  value={firstName}
                  onChange={setFirstName}
                />
                <TextField
                  label="Last name"
                  value={lastName}
                  onChange={setLastName}
                />
                <TextField
                  label="Email address"
                  value={email}
                  onChange={setEmail}
                />
                <HStack>
                  <Button label="Save" variant="primary" />
                </HStack>
              </VStack>
            </Grid>

            <Divider />

            <Grid columns={{minWidth: 320}} gap={10}>
              <VStack gap={1}>
                <Heading level={3}>Change password</Heading>
                <Text variant="small" color="secondary">
                  Update your password to keep your account secure.
                </Text>
              </VStack>
              <VStack gap={4}>
                <TextField
                  label="Verify current password"
                  type="password"
                  value={currentPw}
                  onChange={setCurrentPw}
                />
                <TextField
                  label="New password"
                  type="password"
                  value={newPw}
                  onChange={setNewPw}
                />
                <TextField
                  label="Confirm password"
                  type="password"
                  value={confirmPw}
                  onChange={setConfirmPw}
                />
                <HStack>
                  <Button label="Save" variant="primary" />
                </HStack>
              </VStack>
            </Grid>

            <Divider />

            <Grid columns={{minWidth: 320}} gap={10}>
              <VStack gap={1}>
                <Heading level={3}>Advanced settings</Heading>
                <Text variant="small" color="secondary">
                  Configure detailed account preferences and security options.
                </Text>
              </VStack>
              <VStack gap={5}>
                <Checkbox
                  label="Data Export Access"
                  description="Allow export of personal data and backups."
                  value={dataExport}
                  onChange={setDataExport}
                />
                <Checkbox
                  label="Allow Admin to Add Members"
                  description="Admins can invite and manage members."
                  value={adminMembers}
                  onChange={setAdminMembers}
                />
                <Checkbox
                  label="Enable Two-Factor Authentication"
                  description="Require 2FA for added account security."
                  value={twoFactor}
                  onChange={setTwoFactor}
                />
                <HStack>
                  <Button label="Save" variant="primary" />
                </HStack>
              </VStack>
            </Grid>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
