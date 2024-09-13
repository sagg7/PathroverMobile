import { Text, TouchableOpacity, View } from "react-native"
import { svgIcon } from "../../../../assets/svg"
import styles from "./styles"


interface TruckTypeListProp {
    item?: any;
    onPressCard: () => void;
    selectedVehicle: any
    selectedKey?: any
    onPressClear?: () => void
}

const TruckTypeList = ({ item, onPressCard, selectedVehicle, selectedKey, onPressClear }: TruckTypeListProp) => {
    const selectedModel = selectedVehicle?.model?.find(i => i.isModelSelected)
    const show = item.key === selectedKey
    const trailerData = selectedVehicle?.length && selectedVehicle.find(i => i.isWeightSelected)

    return (
        <TouchableOpacity onPress={onPressCard}>
            <View style={styles.rowStyles}>
                <View style={styles.innerContainer}>
                    {item.icon}
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.clearView}>
                        {show &&
                            <Text style={styles.clearText} onPress={onPressClear}>Clear</Text>
                        }
                    </View>
                    {svgIcon.LeftArrow}
                </View>

                {show && selectedKey < 3 &&
                    <View style={styles.secondaryView}>
                        <View style={styles.WeightContainer}>
                            <Text style={styles.secondaryTitle}>Weight</Text>
                            <Text style={styles.weightText}>{selectedVehicle?.title}</Text>
                        </View>

                        <View style={styles.modalContainer}>
                            <Text style={styles.secondaryTitle}>Model</Text>
                            <Text style={styles.weightText}>{selectedModel?.title}</Text>
                        </View>


                    </View>
                }
                {show && trailerData?.title && selectedKey === 3 &&
                    <View style={styles.secondaryView}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.secondaryTitle}>Model</Text>
                            <Text style={styles.weightText}>{trailerData?.title}</Text>
                        </View>
                    </View>
                }

            </View>
        </TouchableOpacity>
    )
}
export { TruckTypeList }