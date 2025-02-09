import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import React from 'react';
import {MainWrapper} from '../../../../../components';
import styles from './styles';
import {svgIcon} from '../../../../../assets/svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import {appIcons} from '../../../../../assets/icons';
import {useExitGroupMutation} from '../../../../../redux/chat/chatApiSlice';

const GroupButtons = () => {
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
      <TouchableOpacity style={styles.buttonStyle}>
        {svgIcon.PlusIcon}
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const GroupInfoDetail = () => {
  const {params} = useRoute();
  const navigation = useNavigation();
  const [exitGroup] = useExitGroupMutation();

  console.log('==============params======================');
  console.log(params);
  console.log('====================================');

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
      <TouchableOpacity style={styles.footerView} onPress={onPressExit}>
        {svgIcon.Exit}
        <Text style={styles.redText}>Exit Group</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.userContainer} onPress={() => {}}>
        <Image source={appIcons.userPlaceholder} style={styles.imageStyle} />
        <View style={styles.textView}>
          <Text style={styles.nameText}>{item?.name || 'John' || ''}</Text>
          <Text style={styles.adminText}>
            {index === 0 ? 'Group Admin' : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
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
          <Image source={appIcons.menuIcon} style={styles.iconStyle} />
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
        <GroupButtons />
      </View>
      <FlatList
        data={[1, 2, 3, 4, 5, 6.7]}
        renderItem={renderItem}
        ListFooterComponent={listFooterItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item + index.toString()}
      />
    </MainWrapper>
  );
};

export default GroupInfoDetail;
