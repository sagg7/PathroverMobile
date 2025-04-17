import { StackActions } from "@react-navigation/native";

export function replace(name, params) {
  if (navigationRef.isReady()) {
    navigationRef?.current?.dispatch(StackActions.replace(name, params));
  }
}