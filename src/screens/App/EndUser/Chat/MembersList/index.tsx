import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppLoader, MainWrapper} from '../../../../../components';
import {svgIcon} from '../../../../../assets/svg';
import ChatSearch from '../../../../../components/complex/ChatSearch';
import styles from './styles';
import {appIcons} from '../../../../../assets/icons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import UsersListView from '../../../../../components/complex/UsersListView';
import {useGetAllUsersMutation} from '../../../../../redux/chat/chatApiSlice';
import {showAlert} from '../../../../../shared/exporter';

// const dummyArray = [
//   {
//     id: 1,
//     name: 'Alfonso Rhiel Madsen',
//     selected: false,
//   },
//   {
//     id: 2,
//     name: 'Alfonso',
//     selected: false,
//   },
//   {
//     id: 3,
//     name: 'Madsen',
//     selected: false,
//   },
//   {
//     id: 14,
//     name: 'Jade',
//     selected: false,
//   },
//   {
//     id: 24,
//     name: 'Jason',
//     selected: false,
//   },
//   {
//     id: 34,
//     name: 'Mary',
//     selected: false,
//   },
//   {
//     id: 15,
//     name: 'Jack',
//     selected: false,
//   },
//   {
//     id: 25,
//     name: 'Tina',
//     selected: false,
//   },
//   {
//     id: 35,
//     name: 'Watson',
//     selected: false,
//   },
//   {
//     id: 142,
//     name: 'Jade',
//     selected: false,
//   },
//   {
//     id: 242,
//     name: 'Jason',
//     selected: false,
//   },
//   {
//     id: 342,
//     name: 'Mary',
//     selected: false,
//   },
//   {
//     id: 152,
//     name: 'Jack',
//     selected: false,
//   },
//   {
//     id: 252,
//     name: 'Tina',
//     selected: false,
//   },
//   {
//     id: 352,
//     name: 'Watson',
//     selected: false,
//   },
// ];

const MemberList = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
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
          <Image source={appIcons.userPlaceholder} style={styles.imageStyle} />
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

  const onPressForward = () => {
    if (data.selectedMembers?.length > 0) {
      navigation.navigate('CreateGroup', {users: data.selectedMembers});
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
          <TouchableOpacity onPress={() => navigation.pop()}>
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
