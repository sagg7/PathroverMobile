

import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppHeader, MainWrapper} from '../../../components';
import {appImages} from '../../../assets/images';
import {scale, scrWidth} from '../../../shared/theme/responsive';
import RenderHTML from 'react-native-render-html';
import {PFColors} from '../../../shared/exporter';

const TermsAndConditions = () => {
  const source = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formatted Text</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
        h2 {
            color: #333;
        }
        p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <p>Aliquam euismod sodales enim, eget gravida justo vestibulum ac. In semper nunc nisl, vitae sodales tortor pellentesque a. Vivamus sit amet leo hendrerit, faucibus turpis accumsan, consequat ante.</p>

    <h2>Authority</h2>
    <p>Fusce iaculis porttitor tristique. Pellentesque convallis egestas magna ut tempor. Nunc efficitur est eu odio interdum, non elementum enim facilisis. Cras tortor enim, volutpat eu efficitur sit amet, eleifend id quam. Praesent in velit et ligula mattis ornare. Aliquam vehicula turpis egestas nulla auctor, et efficitur erat elementum. Suspendisse sollicitudin, elit sed rutrum aliquam, neque purus tempor ligula, et auctor sapien diam vel ipsum. Sed viverra massa non tellus venenatis gravida. Vestibulum suscipit posuere risus, ac luctus enim vestibulum vitae. Nam non purus sit amet ex malesuada pulvinar eget ac urna. Suspendisse potenti. Quisque non facilisis ex.</p>

    <h2>Purpose</h2>
    <p>Fusce iaculis porttitor tristique. Pellentesque convallis egestas magna ut tempor. Nunc efficitur est eu odio interdum, non elementum enim facilisis. Cras tortor enim, volutpat eu efficitur sit amet, eleifend id quam. Praesent in velit et ligula mattis ornare. Aliquam vehicula turpis egestas nulla auctor, et efficitur erat elementum.</p>
    </body>
</html>
`,
  };
  return (
    <MainWrapper>
      <AppHeader title="Terms & Conditions" />
      <ScrollView>
        <Image source={appImages.termsBanner} style={styles.bannerImage} />
        <View style={styles.bodyContainer}>
          <RenderHTML
              contentWidth={scrWidth}
            source={source}
            baseStyle={styles.htmlBaseStyle}
          />
        </View>
      </ScrollView>
    </MainWrapper>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  bannerImage: {
    height: scale(201),
    width: scale(375),
    resizeMode: 'contain',
    borderBottomRightRadius: scale(24),
    borderBottomLeftRadius: scale(24),
  },
  bodyContainer: {
    flex: 1,
    padding: scale(16),
  },
  htmlBaseStyle: {
    color: PFColors.Standard.Black,
  },
});
