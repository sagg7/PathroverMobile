import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import {appImages} from '../../../../../assets/images';
import {svgIcon} from '../../../../../assets/svg';
import {useSelector} from 'react-redux';
import dayjs from 'dayjs';
import {useCreateTrailCommentMutation} from '../../../../../redux/endUser/endUserApiSlice';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  isIOS,
  PFColors,
  showAlert,
  UNEXPECTED_ERROR,
  WP,
} from '../../../../../shared/exporter';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const Reviews = () => {
  const {selectedCustomTrail} = useSelector(
    (state: any) => state?.endUser?.trailRoute,
  );
  const [createTrailComment, {isLoading}] = useCreateTrailCommentMutation();
  const [comments, setComments] = useState<any>([]);
  const [text, setText] = useState<any>(null);
  const [photo, setPhoto] = useState<any>(null);

  useEffect(() => {
    if (selectedCustomTrail?.comments)
      setComments(selectedCustomTrail?.comments);
  }, [selectedCustomTrail]);

  const renderItemImage = image_url => {
    return (
      <Image
        source={{uri: image_url}}
        style={styles.imageStyle}
        resizeMode="cover"
      />
    );
  };

  const renderCommentCard = ({item}: any) => {
    return (
      <View style={styles.rateCardContainer}>
        <View style={styles.cardHeader}>
          <View style={styles.rightView}>
            <Image
              source={
                item?.user_avatar
                  ? {uri: item?.user_avatar}
                  : appImages.userPlaceholder
              }
              style={styles.userImageStyle}
            />
          </View>
        </View>
        <View style={styles.commentSectionView}>
          <Text style={styles.nameText}>
            {item?.user_first_name} {item?.user_last_name}
            <Text style={styles.dateText}>
              {'\t'} {dayjs(item?.created_at).format('MM/DD/YY')}
            </Text>
          </Text>
          {item?.text != null && (
            <Text style={styles.detailsText}>{item?.text}</Text>
          )}
          {item?.image_url && renderItemImage(item?.image_url)}
        </View>
      </View>
    );
  };

  const postCommennt = async () => {
    const data: any = new FormData();
    if (text) {
      data.append('trails_comment[text]', text);
    }
    data.append('trails_comment[trail_id]', selectedCustomTrail?.id);

    if (photo?.path) {
      data.append('trails_comment[image]', {
        uri: isIOS() ? photo.sourceURL : photo.path,
        type: photo.mime,
        name: photo.filename,
      });
    }

    const resp = await createTrailComment(data);

    if (resp?.data?.id) {
      setComments(prev => [resp?.data, ...prev]);
      setText(null);
      setPhoto(null);
      Keyboard.dismiss();
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  const handleGallery = () => {
    setTimeout(() => {
      ImageCropPicker.openPicker({
        width: 300,
        height: 300,
        mediaType: 'photo',
        maxFiles: 1,
      })
        .then(image => {
          setPhoto(image);
        })
        .catch(error => {
          console.log('Error picking image: ', error);
        });
    }, 500);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        scrollToOverflowEnabled={false}>
        <View style={styles.commentInputContainer}>
          <View style={styles.commentInner}>
            <TouchableOpacity onPress={handleGallery}>
              {photo ? (
                <Image
                  style={{height: 50, width: 50, borderRadius: 20}}
                  source={{uri: photo?.path}}
                  resizeMode="cover"
                />
              ) : (
                svgIcon.CommentGallery
              )}
            </TouchableOpacity>
            <View style={styles.contentContainer}>
              <TextInput
                multiline
                placeholderTextColor={PFColors.Gray.AshGray}
                placeholder="Add a comment"
                style={styles.inputStyles}
                value={text}
                onChangeText={t => setText(t)}
                textAlignVertical="center"
              />
            </View>
          </View>
          {isLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator size={'small'} color={PFColors.Blue.Dark} />
            </View>
          ) : (
            <TouchableOpacity
              onPress={postCommennt}
              disabled={!text?.trim() && !photo}
              style={{
                opacity: !text?.trim() && !photo ? 0.5 : 1,
                marginLeft: WP('1'),
              }}>
              {svgIcon.SendComment}
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          nestedScrollEnabled
          data={comments}
          keyExtractor={item => item.id.toString()}
          renderItem={renderCommentCard}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: 100}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.noFound}>No Comments Found</Text>
          }
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Reviews;
