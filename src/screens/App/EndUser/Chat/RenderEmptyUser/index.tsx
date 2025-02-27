import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { HP, PFColors } from '../../../../../shared/exporter';

const RenderEmptyUser = () => (
  <Text style={styles.emptyText}>No users found</Text>
);

export default RenderEmptyUser;

const styles = StyleSheet.create({
    emptyText:{
        fontSize: 16,
        color:PFColors.Standard.Black,
        textAlign:'center',
        marginTop:HP('35')
    }
});
