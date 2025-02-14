import React from "react"
import { StyleSheet } from "react-native"
import { Time } from "react-native-gifted-chat"
import { PFFontSize } from "../../../shared/exporter"


const RenderTime = (props) => {
  return (
    <Time
      {...props}
      timeTextStyle={{
        left: styles.leftTextStyle,
        right: styles.rightTextStyle,
      }}
    />
  )
}

const styles = StyleSheet.create({
  leftTextStyle: {
    fontSize: PFFontSize.FONT_SIZE_14,
  },
  rightTextStyle: {
    fontSize: PFFontSize.FONT_SIZE_14,
  },
})

export { RenderTime }
