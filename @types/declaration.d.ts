declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
declare module '@env' {
    export const API_URL: string;
    export const APP_MAJOR_VERSION: string;
    export const APP_MINOR_VERSION: string;
    export const APP_PATCH_VERSION: string;
 }