import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {svgIcon} from '../../../../../assets/svg';
import {AppButton, MainWrapper} from '../../../../../components';
import UsersListView from '../../../../../components/complex/UsersListView';
import {useKeyboardListener} from '../../../../../hooks/keyboard';
import {useCreateGroupMutation} from '../../../../../redux/chat/chatApiSlice';
import {
  IMAGE_OPTIONS,
  PFColors,
  showAlert,
} from '../../../../../shared/exporter';
import styles from './styles';

const CreateGroup = () => {
  const {params} = useRoute();
  const navigation = useNavigation();
  const keyboardVisible = useKeyboardListener();

  const [name, setName] = useState('');
  const [usersList, setUsersList] = useState('');
  const [image, setImage] = useState(null);

  const [createGroup, {isLoading, isError, error}] = useCreateGroupMutation();

  useEffect(() => {
    if (params?.users) {
      setUsersList(params?.users);
    }
  }, [params?.users]);

  useEffect(() => {
    if (error) {
      showAlert(
        'Error',
        error?.data?.error || 'Unable to process request. Please try again!.',
      );
    }
  }, [isError]);

  const onPressItem = (item: object) => {
    setUsersList(usersList.filter(i => i.id !== item.id));
  };

  const onPress = async () => {
    if (name && usersList?.length > 0) {
      try {
        const form = new FormData();
        form.append('group[name]', name);
        if (usersList?.length > 0) {
          for (i = 0; i < usersList.length; i++) {
            form.append('group[user_ids][]', usersList[i]?.id);
          }
        }

        if (image) {
          form.append('group[image]', {
            uri:
              Platform.OS === 'ios'
                ? image?.uri.replace('file://', '')
                : image?.uri,
            type: image?.type,
            name: image?.fileName,
          });
        }

        const res = await createGroup(form);

        if (res.data) {
          navigation.navigate('Chat');
        }
      } catch (error) {
        //
      }
    } else if (!name) {
      showAlert('Create Group', 'Please enter group name');
    } else if (usersList?.length === 0) {
      showAlert(
        'Create Group',
        'Please select at least 1 member to create group',
      );
    }
  };

  const onPressImage = async () => {
    const result = await launchImageLibrary(IMAGE_OPTIONS);
    if (result?.assets) {
      setImage(result?.assets[0]);
    }
  };

  return (
    <MainWrapper>
      <View style={styles.groupHeader}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          {svgIcon.BackArrow}
        </TouchableOpacity>
        <View style={styles.headerTextView}>
          <Text style={styles.groupNameText}>New Group</Text>
        </View>
      </View>
      <View style={styles.topView}>
        <TouchableOpacity onPress={onPressImage}>
          {image ? (
            <Image source={{uri: image?.uri}} style={styles.imageStyle} />
          ) : (
            <>{svgIcon.GroupName}</>
          )}
        </TouchableOpacity>
        <TextInput
          value={name}
          placeholder={'Group Name'}
          placeholderTextColor={PFColors.Gray.DarkGray}
          onChangeText={text => setName(text)}
          style={styles.textInputStyle}
        />
        {/* {svgIcon.MaskMan} */}
      </View>
      <Text style={styles.memberText}>Members {usersList?.length || ''}</Text>
      <UsersListView
        usersList={usersList}
        onPress={item => onPressItem(item)}
      />
      <AppButton
        title="Create Group"
        buttonStyle={styles.buttonStyle(keyboardVisible)}
        handleClick={onPress}
        isLoading={isLoading}
      />
    </MainWrapper>
  );
};

export default CreateGroup;
