import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppLoader, MainWrapper } from '../../../../../components';
import { svgIcon } from '../../../../../assets/svg';
import ChatSearch from '../../../../../components/complex/ChatSearch';
import styles from './styles';
import { appIcons } from '../../../../../assets/icons';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import UsersListView from '../../../../../components/complex/UsersListView';
import {
  useAddMembersMutation,
  useGetAllUsersMutation,
  useGetChatContactsMutation,
} from '../../../../../redux/chat/chatApiSlice';
import { showAlert } from '../../../../../shared/exporter';
import { Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Contacts from 'react-native-contacts';
import RenderEmptyUser from '../RenderEmptyUser';

const MemberList = () => {
  const { params } = useRoute<any>();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [addMembers] = useAddMembersMutation<any>();
  const [matchedUsers, setMatchedUsers] = useState<any[]>([]);
  const [allContactsList, setAllContactsList] = useState<any[]>([]);
  const [data, setData] = useState({
    search: '',
    showSearch: false,
    members: [],
    selectedMembers: [],
  });

  const [getAllUsers, { isLoading, data: allData }] =
    useGetChatContactsMutation();

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
          const allUsers = await getAllUsers({ users: allContacts }).unwrap();
          const formattedContacts = formatContacts(allUsers?.data);
          // Save full contacts list

          const filteredContacts = formattedContacts.filter(
            (contact: any) => contact?.is_exist)

          setAllContactsList(filteredContacts);
          setMatchedUsers(filteredContacts);
        } else {
          console.warn('Contacts permission denied');
        }
      }
    })();
  }, [isFocused]);

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
      if (data.search?.length > 0) {
        const searchText = data.search.toLowerCase();
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
  }, [data.search, allContactsList]);

  const onPressItem = (item: any) => {
    const exists = data.selectedMembers.some((obj: any) => obj.id === item.id);

    if (exists) {
      setData(prevData => ({
        ...prevData,
        selectedMembers: prevData.selectedMembers.filter(
          (obj: any) => obj.id !== item.id,
        ),
      }));
    } else {
      setData((prevData: any) => ({
        ...prevData,
        selectedMembers: [...prevData.selectedMembers, item],
      }));
    }
  };

  const renderItem = ({ item }: any) => {
    const exists = data.selectedMembers.some(
      (member: any) => member.id === item.id,
    );

    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() => onPressItem(item)}>
        <View>
          <Image
            source={
              item?.profile_image
                ? { uri: item?.profile_image }
                : appIcons.userPlaceholder
            }
            style={styles.imageStyle}
          />
          {exists && <View style={styles.iconView}>{svgIcon.AddedIcon}</View>}
        </View>
        <View style={styles.textView}>
          <Text style={styles.nameText}>{
            item?.displayName ||
            (
              (item?.givenName && item?.familyName)
                ? `${item.givenName} ${item.familyName}`
                : item?.givenName || item?.familyName     
            ) ||
            'User' 
          }</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onPressForward = async () => {
    if (data.selectedMembers?.length > 0) {
      if (params?.isAdd) {
        const obj = {
          group_id: params?.item?.id,
          user_ids: data.selectedMembers?.map((i: any) => i?.id),
        };

        const response = await addMembers(obj);
        if (response?.data) {
          navigation.pop();
        }
      } else {
        navigation.navigate('CreateGroup', { users: data.selectedMembers });
      }
    } else {
      showAlert(
        'Create Group',
        'Please select at least 1 member to create group',
      );
    }
  };

  const listHeaderComponent = () => {
    return (
      data.selectedMembers?.length > 0 && (
        <UsersListView
          usersList={data.selectedMembers}
          onPress={item => onPressItem(item)}
        />
      )
    );
  };

  return (
    <MainWrapper>
      <View style={styles.groupHeader}>
        <View style={styles.topHeaderView}>
          <TouchableOpacity onPress={() => navigation.pop()} hitSlop={20}>
            {svgIcon.BackArrow}
          </TouchableOpacity>
          <View style={styles.headerTextView}>
            <Text style={styles.groupNameText}>New Group</Text>
            <Text style={styles.subText}>Add Members</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setData(prev => {
                return { ...prev, showSearch: !prev.showSearch };
              });
            }}>
            {svgIcon.Search}
          </TouchableOpacity>
        </View>
        {data.showSearch && (
          <ChatSearch
            placeholder="Search for members"
            value={data.search}
            onChangeText={text => setData(prev => ({ ...prev, search: text }))}
          />
        )}
      </View>
      {isLoading ? (
        <AppLoader />
      ) : (
        <FlatList
          data={matchedUsers}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeaderComponent}
          contentContainerStyle={styles.flatListStyle}
          keyExtractor={(item, index) => item + index.toString()}
          ListEmptyComponent={isLoading ? <></> : <RenderEmptyUser />}
        />
      )}
      <TouchableOpacity
        disabled={isLoading}
        style={styles.moveForwardButton}
        onPress={onPressForward}>
        {svgIcon.MoveForward}
      </TouchableOpacity>
    </MainWrapper>
  );
};

export default MemberList;
