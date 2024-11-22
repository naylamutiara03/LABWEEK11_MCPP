import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { savePhotoUriAndLocationToFirestore } from './firestoreFunctions';
import { StatusBar } from 'expo-status-bar';

const ImagePickerComponent = () => {
  const [uri, setUri] = useState('');
  const [location, setLocation] = useState(null);

  const handleCameraLaunch = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'You need to enable permission to access the camera.');
      return;
    }

    const response = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!response.canceled && response.assets && response.assets.length > 0) {
      const imageUri = response.assets[0].uri;
      setUri(imageUri);
      console.log('Image URI:', imageUri);
    } else {
      Alert.alert('Cancelled', 'No photo was taken.');
    }
  };

  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'You need to enable permission to access the photo library.');
      return;
    }

    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!response.canceled && response.assets && response.assets.length > 0) {
      const imageUri = response.assets[0].uri;
      setUri(imageUri);
      console.log('Image URI:', imageUri);
    } else {
      Alert.alert('Cancelled', 'No image was selected.');
    }
  };

  const saveToLocalAndFirestore = async () => {
    if (!uri) {
      Alert.alert('No image selected', 'Please capture or select an image first.');
      return;
    }

    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    if (!mediaLibraryPermission.granted) {
      Alert.alert('Permission required', 'You need to enable permission to save images to the gallery.');
      return;
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      console.log('Image saved to Camera Roll:', asset.uri);

      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (!locationPermission.granted) {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const locationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setLocation(locationData);

      console.log('Location Data:', locationData);

      await savePhotoUriAndLocationToFirestore(asset.uri, locationData);
      Alert.alert('Success', 'Image and location saved to Firestore and device.');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nayla Mutiara Salsabila Bastari - 00000075205</Text>
      <Button title="Open Camera" onPress={handleCameraLaunch} color="#1E90FF" />
      <Button title="Open Gallery" onPress={openImagePicker} color="#1E90FF" />

      {uri ? (
        <>
          <Image source={{ uri }} style={styles.image} />
          <Button title="Save to Local and Firestore" onPress={saveToLocalAndFirestore} color="#1E90FF" />
        </>
      ) : (
        <Text>No image selected</Text>
      )}

      {location && (
        <Text>
          Location: {location.latitude}, {location.longitude}
        </Text>
      )}

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default ImagePickerComponent;