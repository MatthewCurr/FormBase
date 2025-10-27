// Photo.jsx

// ================================
// React Native Imports
// ================================
import { View, Image, Dimensions } from "react-native";

// Get the screen width and height for styling
const { height } = Dimensions.get("window");

/**
 * Component to display the selected photo or a placeholder
 *
 * @param {Object} props - Component props
 * @param {boolean} props.hasPhoto - Indicates if a photo has been selected.
 * @param {Object} props.photoState - The photo object containing URI and other info.
 * @return {React.Element} - The photo display component.
 */
export default function Photo({ hasPhoto, photoState }) {
    if (hasPhoto) {
      console.log("Photo URI:", photoState.uri);
        return (
            <View>
                <Image
                    style={{ width: "100%", height: height/3, borderRadius: 10 }}
                    resizeMode="cover"
                    source={{ uri: photoState.uri }}
                />
            </View>
        );
    } else {
        return <View />;
    }
}