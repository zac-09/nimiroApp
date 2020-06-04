import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const PickLocationScreen = (props) => {
	const [selectedLocation, setSelectedLocation] = useState();
	_getAddress = async (pickedLocation) => {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pickedLocation.lat},${pickedLocation.lng}&key=AIzaSyAfO6Pi32GUCliRVfwUxc7mK4ZNaQ9a8Mk`
		);

		if (!response.ok) {
			throw new Error('Something went wrong!');
			console.log('an error occore');
		}
		const resData = await response.json();
		if (!resData.results) {
			throw new Error('Something went wrong!');
		}

		const address = resData.results[0].formatted_address;
		console.log('the data object is ', resData);

		console.log('the city is ', address);
		return address;
	};
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
		console.log("the selected location is",selectedLocation)
		_getAddress(selectedLocation);

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
			<MapView style={styles.map} initialRegion={mapRegion} onPress={selectLocationHandler}>
				{markerCoordinates && <Marker title="Picked Location" coordinate={markerCoordinates} />}
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
		headerStyle: {
			backgroundColor: Platform.OS === 'android' ? 'rgba(0, 8, 228, 0.9)' : '',
		},
		headerTintColor: Platform.OS === 'android' ? 'white' : 'rgba(0, 8, 228, 0.9)',
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
