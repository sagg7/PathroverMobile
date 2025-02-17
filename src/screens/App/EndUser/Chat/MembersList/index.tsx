import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppLoader, MainWrapper} from '../../../../../components';
import {svgIcon} from '../../../../../assets/svg';
import ChatSearch from '../../../../../components/complex/ChatSearch';
import styles from './styles';
import {appIcons} from '../../../../../assets/icons';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import UsersListView from '../../../../../components/complex/UsersListView';
import {
  useAddMembersMutation,
  useGetAllUsersMutation,
} from '../../../../../redux/chat/chatApiSlice';
import {showAlert} from '../../../../../shared/exporter';

const MemberList = () => {
  const {params} = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [addMembers] = useAddMembersMutation();
  const [getAllUsers, {isLoading, data: userData}] = useGetAllUsersMutation();

  const [data, setData] = useState({
    search: '',
    showSearch: false,
    members: [],
    selectedMembers: [],
  });

  useEffect(() => {
    (async () => {
      if (isFocused) {
        await getAllUsers();
      }
    })();
  }, [isFocused]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (data.search.length > 0 && data.members?.length > 0) {
        const searchText = data.search.toLowerCase();
        setData(prevState => ({
          ...prevState,
          members: data.members?.filter(
            user =>
              user?.first_name?.toLowerCase()?.includes(searchText) ||
              user?.last_name?.toLowerCase()?.includes(searchText),
          ),
        }));
      } else {
        setData(prevState => ({
          ...prevState,
          members: userData?.users,
        }));
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [data.search]);

  useEffect(() => {
    if (userData?.users.length > 0) {
      setData(prev => ({...prev, members: userData.users}));
    }
  }, [userData]);

  const onPressItem = (item: object) => {
    const exists = data.selectedMembers.some(obj => obj.id === item.id);

    if (exists) {
      setData(prevData => ({
        ...prevData,
        selectedMembers: prevData.selectedMembers.filter(
          obj => obj.id !== item.id,
        ),
      }));
    } else {
      setData(prevData => ({
        ...prevData,
        selectedMembers: [...prevData.selectedMembers, item],
      }));
    }
  };

  const renderItem = ({item}) => {
    const exists = data.selectedMembers.some(member => member.id === item.id);

    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() => onPressItem(item)}>
        <View>
          <Image
            source={
              item?.avatar ? {uri: item?.avatar} : appIcons.userPlaceholder
            }
            style={styles.imageStyle}
          />
          {exists && <View style={styles.iconView}>{svgIcon.AddedIcon}</View>}
        </View>
        <View style={styles.textView}>
          <Text style={styles.nameText}>
            {item?.first_name || 'User'} {item?.last_name || ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onPressForward = async () => {
    if (data.selectedMembers?.length > 0) {
      if (params?.isAdd) {
        const obj = {
          group_id: params?.item?.id,
          user_ids: data.selectedMembers?.map(i => i?.id),
        };

        const response = await addMembers(obj);
        if (response?.data) {
          navigation.pop();
        }
      } else {
        navigation.navigate('CreateGroup', {users: data.selectedMembers});
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
                return {...prev, showSearch: !prev.showSearch};
              });
            }}>
            {svgIcon.Search}
          </TouchableOpacity>
        </View>
        {data.showSearch && (
          <ChatSearch
            placeholder="Search for members"
            value={data.search}
            onChangeText={text => setData(prev => ({...prev, search: text}))}
          />
        )}
      </View>
      {isLoading ? (
        <AppLoader />
      ) : (
        <FlatList
          data={data.members}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeaderComponent}
          contentContainerStyle={styles.flatListStyle}
          keyExtractor={(item, index) => item + index.toString()}
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
