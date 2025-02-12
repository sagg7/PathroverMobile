import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AppButton, MainWrapper} from '../../../../../components';
import styles from './styles';
import {svgIcon} from '../../../../../assets/svg';
import UsersListView from '../../../../../components/complex/UsersListView';
import {useKeyboardListener} from '../../../../../hooks/keyboard';
import {launchImageLibrary} from 'react-native-image-picker';
import {IMAGE_OPTIONS, showAlert} from '../../../../../shared/exporter';
import {useCreateGroupMutation} from '../../../../../redux/chat/chatApiSlice';

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
    if (name) {
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
    } else {
      alert('Please enter group name');
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
          onChangeText={text => setName(text)}
          style={styles.textInputStyle}
        />
        {svgIcon.MaskMan}
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
