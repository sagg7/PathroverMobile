import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MainWrapper} from '../../../../../components';
import styles from './styles';
import {svgIcon} from '../../../../../assets/svg';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {appIcons} from '../../../../../assets/icons';
import {
  useExitGroupMutation,
  useGetGroupInfoMutation,
} from '../../../../../redux/chat/chatApiSlice';
import {showAlert} from '../../../../../shared/exporter';

const GroupButtons = ({onPressAdd}) => {
  return (
    <View style={styles.buttonView}>
      <TouchableOpacity style={styles.buttonStyle}>
        {svgIcon.BlackPhone}
        <Text style={styles.buttonText}>Audio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonStyle}>
        {svgIcon.VideoIcon}
        <Text style={styles.buttonText}>Video</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonStyle} onPress={onPressAdd}>
        {svgIcon.PlusIcon}
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const GroupInfoDetail = () => {
  const {params} = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [exitGroup, {isError, error}] = useExitGroupMutation();
  const [getGroupInfo, {isLoading, data}] = useGetGroupInfoMutation();

  const [members, setMembers] = useState([]);

  useEffect(() => {
    (async () => {
      if (isFocused && params?.item) {
        await getGroupInfo(params?.item?.id);
      }
    })();
  }, [isFocused, params]);

  useEffect(() => {
    if (error) {
      showAlert(
        'Error',
        error?.data?.error ||
          error?.data?.success ||
          'Unable to process request. Please try again!.',
      );
    }
  }, [isError]);

  useEffect(() => {
    if (data) {
      setMembers(data);
    }
  }, [data]);

  const onPressExit = async () => {
    try {
      const obj = {
        group_id: params?.item?.id,
      };
      const res = await exitGroup(obj);

      if (res?.data) {
        navigation.navigate('Chat');
      }
    } catch (error) {
      //
    }
  };

  const listFooterItem = () => {
    return (
      !members?.is_exit && (
        <TouchableOpacity style={styles.footerView} onPress={onPressExit}>
          {svgIcon.Exit}
          <Text style={styles.redText}>Exit Group</Text>
        </TouchableOpacity>
      )
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.userContainer} onPress={() => {}}>
        <Image
          source={
            item?.avatar_url
              ? {uri: item?.avatar_url}
              : appIcons.userPlaceholder
          }
          style={styles.imageStyle}
        />
        <View style={styles.textView}>
          <Text style={styles.nameText}>
            {item?.first_name || item?.last_name
              ? `${item?.first_name || ''} ${item?.last_name || ''}`.trim()
              : 'User'}
          </Text>
          <Text style={styles.adminText}>
            {item?.is_admin ? 'Group Admin' : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onPressAdd = () => {
    navigation.navigate('MemberList', {
      isAdd: true,
      item: params?.item,
      members: members?.users,
    });
  };

  return (
    <MainWrapper>
      <View style={styles.groupHeader}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          {svgIcon.BackArrow}
        </TouchableOpacity>
        <View style={styles.headerTextView}>
          <Text style={styles.groupNameText}>Group Info</Text>
        </View>

        <TouchableOpacity onPress={() => {}}>
          <Image source={appIcons.menuIcons} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
      <View style={styles.topView}>
        <Image
          source={
            params?.item?.image_url
              ? {uri: params?.item?.image_url}
              : appIcons.userPlaceholder
          }
          style={styles.groupImage}
        />
        <Text style={styles.headerText}>{params?.item?.name || ''}</Text>
        <Text style={styles.subHeaderText}>Group| 8 Members</Text>
        <GroupButtons onPressAdd={onPressAdd} />
      </View>
      <FlatList
        data={members?.users}
        renderItem={renderItem}
        ListFooterComponent={listFooterItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item + index.toString()}
      />
    </MainWrapper>
  );
};

export default GroupInfoDetail;
