import React from 'react';
import {StyleSheet} from 'react-native';
import {Actions} from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-crop-picker'; // Import Image Picker
import {svgIcon} from '../../../assets/svg';

const RenderActions = props => {
  const handleImagePick = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true, // Enable cropping
    })
      .then(image => {
        // Prepare the message object with image
        const message = {
          _id: Math.random().toString(36).substring(7), // Random id for the message
          text: '', // No text since it's an image
          createdAt: new Date(),
          user: {
            _id: props.user._id, // Ensure the user is correctly assigned
            name: props.user.name,
          },
          image: image, // Attach the image path to the message
        };

        // Call onSend to send the image as a message
        props.onSend([message]);
      })
      .catch(error => {
        console.log('Error picking image: ', error);
      });
  };

  return (
    <Actions
      {...props}
      onPressActionButton={handleImagePick}
      icon={() => <>{svgIcon.AddButton}</>}
      containerStyle={styles.containerStyle}
    />
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    // justifyContent: 'center',
    // alignSelf: 'flex-end',
    // marginBottom: 5,
    left: -15,
    height: 44,
    width: 44,
  },
});

export default RenderActions;
