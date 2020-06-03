import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const PickLocationScreen = (props) => {
	const [selectedLocation, setSelectedLocation] = useState();
	const [mapReady, setMapReady] = useState(false);
	const mapRegion = {
		latitude: 0.347596,
		longitude: 32.58252,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	};

	const selectLocationHandler = (event) => {
		setSelectedLocation({
			lat: event.nativeEvent.coordinate.latitude,
			lng: event.nativeEvent.coordinate.longitude,
		});
	};

	const savePickedLocationHandler = useCallback(() => {
		if (!selectedLocation) {
			// could show an alert!
			return;
		}
		props.navigation.navigate('Maps', { pickedLocation: selectedLocation });
	}, [selectedLocation]);

	useEffect(() => {
		props.navigation.setParams({ saveLocation: savePickedLocationHandler });
	}, [savePickedLocationHandler]);

	let markerCoordinates;

	if (selectedLocation) {
		markerCoordinates = {
			latitude: selectedLocation.lat,
			longitude: selectedLocation.lng,
		};
	}

	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				initialregion={mapRegion}
				onPress={selectLocationHandler}
				onMapReady={setMapReady(true)}
			>
				{markerCoordinates && mapReady && <Marker title="Picked Location" coordinate={markerCoordinates} />}
			</MapView>
		</View>
	);
};

PickLocationScreen.navigationOptions = (navData) => {
	const saveFn = navData.navigation.getParam('saveLocation');
	return {
		headerRight: (
			<TouchableOpacity style={styles.headerButton} onPress={saveFn}>
				<Text style={styles.headerButtonText}>Save</Text>
			</TouchableOpacity>
		),
	};
};

const styles = StyleSheet.create({
	map: {
		width: '100%',
		height: '100%',
	},
	headerButton: {
		marginHorizontal: 20,
	},
	headerButtonText: {
		fontSize: 16,
		color: Platform.OS === 'android' ? 'white' : 'black',
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default PickLocationScreen;