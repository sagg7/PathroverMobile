import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {appIcons} from '../../../../../assets/icons';
import ChatIcon from '../../../../../assets/svg/chatIcon.svg';
import {
  AppButton,
  AppHeader,
  AppLoader,
  MainWrapper,
} from '../../../../../components';
import ChatSearch from '../../../../../components/complex/ChatSearch';
import {
  useCreateChatMutation,
  useGetChatContactsMutation,
} from '../../../../../redux/chat/chatApiSlice';
import {WP} from '../../../../../shared/exporter';
import styles from './styles';
import RenderEmptyUser from '../RenderEmptyUser';

const ChatUsers = () => {
  const {params} = useRoute<any>();
  const shareTrail = params?.shareTrail;
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [matchedUsers, setMatchedUsers] = useState<any[]>([]);
  const [allContactsList, setAllContactsList] = useState<any[]>([]);
  console.log(" ChatUsers ~ allContactsList==>", allContactsList[1])

  // API
  // const [getAllUsers, {isLoading, data}] = useGetAllUsersMutation();
  const [getAllUsers, {isLoading, data}] = useGetChatContactsMutation();
  const [createChat] = useCreateChatMutation();

  const requestContactsPermission = async () => {
    let permission;

    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CONTACTS;
    } else {
      permission = PERMISSIONS.ANDROID.READ_CONTACTS;
    }

    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      const requestResult = await request(permission);
      return requestResult === RESULTS.GRANTED;
    }
  };

  useEffect(() => {
    (async () => {
      if (isFocused) {
        const permissionGranted = await requestContactsPermission();
        if (permissionGranted) {
          const allContacts = await Contacts.getAll();
          const allUsers = await getAllUsers({users: allContacts}).unwrap();
          const formattedContacts = formatContacts(allUsers?.data);
          setAllContactsList(formattedContacts);
          setMatchedUsers(formattedContacts);
        } else {
          console.warn('Contacts permission denied');
        }
      }
    })();
  }, [isFocused]);

  const normalizePhoneNumber = (phone: any) => {
    return phone.replace(/[\s\-()]/g, '')
  };

  const formatContacts = (contacts: any = []) => {
    const sortedContacts = [...contacts].sort((a: any, b: any) => {
      const nameA = a?.givenName || ''; 
      const nameB = b?.givenName || '';

      if (a.is_exist === b.is_exist) {
        return nameA.localeCompare(nameB);
      } else {
        return b.is_exist - a.is_exist;
      }
    });
    return sortedContacts;
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search?.length > 0) {
        const searchText = search.toLowerCase();
        const filteredContacts = allContactsList.filter(
          (user: any) =>
            user?.givenName?.toLowerCase()?.includes(searchText) ||
            user?.familyName?.toLowerCase()?.includes(searchText),
        );
        setMatchedUsers(filteredContacts);
      } else {
        setMatchedUsers(allContactsList);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [search, allContactsList]);

  const initiateChat = async (item: any) => {
    try {
      const obj = {
        chat: {
          chat_type: 0,
          chat_members_attributes: [{user_id: item?.id}],
        },
      };
      const res = await createChat(obj);
      if (res?.data) {
        navigation.navigate('ChatDetail', {
          item: res?.data,
          isGroup: false,
          ...(shareTrail && {shareTrail}),
        });
      }
    } catch (error) {
      //
    }
  };

  const inviteUser = (data: any) => {
    const phone_number = data?.phoneNumbers?.[0]?.number;
    const phoneNumber =
      phone_number?.startsWith('+') || phone_number?.startsWith('0')
        ? phone_number
        : `+1${phone_number}`;
    let url = `sms:${normalizePhoneNumber(phoneNumber)}`;
    const separator = Platform.OS === 'ios' ? '&' : '?';
    url += `${separator}body=${encodeURIComponent(
      `Let's chat on Pathrover! It's a fast, simple, and secure app we can use to message and call each other for free`,
    )}`;
    console.log(" inviteUser ~ url==>", url)

    Linking.openURL(url).catch(err => console.log('Error opening SMS:', err));
  };

  const renderItem = ({item, index}: any) => {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Image
            source={
              item?.profile_image
                ? {uri: item?.profile_image}
                : appIcons.userPlaceholder
            }
            style={styles.imageStyle}
          />
          <Text style={styles.nameText}>{item?.givenName || 'User'}</Text>
        </View>
        {item?.is_exist ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => initiateChat(item)}>
            <ChatIcon height={WP('11')} width={WP('11')} />
          </TouchableOpacity>
        ) : (
          <AppButton
            title={'Invite'}
            handleClick={() => inviteUser(item)}
            buttonStyle={{width: '23%', height: WP('7')}}
            textStyle={{fontSize: 12}}
          />
        )}
      </View>
    );
  };

  return (
    <MainWrapper>
      <AppHeader title="All Users" clickBackIcon={() => navigation.pop()} />
      <ChatSearch
        value={search}
        placeholder="Search"
        onChangeText={text => setSearch(text)}
      />
      {isLoading ? (
        <AppLoader />
      ) : (
        <FlatList
          data={matchedUsers}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={isLoading ? <></> : <RenderEmptyUser />}
        />
      )}
    </MainWrapper>
  );
};

export default ChatUsers;
