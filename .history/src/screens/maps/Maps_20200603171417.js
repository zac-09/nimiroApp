import React from 'react';

import MapView, { Marker } from 'react-native-maps';
import {
	StyleSheet,
	Platform,
	Text,
	Dimensions,
	TouchableWithoutFeedback,
	View,
	ScrollView,
	Button,
	TextInput,
} from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import Pin from '../../components/markers/Pin';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { formatDate } from '../../utils/Validations';
import { Radio, RadioGroup, RadioButton } from 'radio-react-native';

export default class Maps extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			location: {
				latitude: 0.347596,
				longitude: 32.58252,
			},
			errorMessage: null,
			markers: [],
			showDetais: false,
			details: null,
			type: 'fellowship',
			title: '',
			pickedLocation: this.props.navigation.getParam('pickedLocation')
				? this.props.navigation.getParam('pickedLocation')
				: '',
			eventDetails: '',
			typeIndex: 0,
			isAddEvent: false,
			address: this.props.navigation.getParam('pickedLocation')
				? this._getAddress(this.state.pickedLocation)
				: '',
		};

		this.threadsRef = firebase.firestore().collection('maps');

		this.threadsUnscribe = 'null';
	}

	componentDidMount() {
		if (Platform.OS === 'android' && !Constants.isDevice) {
			this.setState({
				errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
			});
		} else {
			this._getLocationAsync();
		}
		this.threadsUnscribe = this.threadsRef.onSnapshot(this._getMarkersAsync);
	}

	componentWillUnmount() {
		this.threadsUnscribe();
	}
	addEventHandler = async () => {
		await firebase.firestore().collection('maps');
	};

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
		console.log('the city is ', address);
		return address;
	};
	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Permission to access location was denied',
			});
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		// console.log("location acquired from expo",location)
		this.setState({ location: location.coords });
	};

	_getMarkersAsync = async (querySnapshot) => {
		const data = [];
		try {
			querySnapshot.forEach((doc) => {
				const marker = doc.data();
				data.push(marker);
			});
		} catch (error) {
			this.setState({ errorMessage: error.message });
		}

		// console.log("these are the markers",data);
		this.setState({ markers: data, errorMessage: null });
	};

	render() {
		const { location, markers, showDetais, details, isAddEvent } = this.state;
		const canceled = details ? (details.status_id === 'b0Q7JzsYXBBeBLbG9nb0' ? true : false) : false;
		return (
			<View style={styles.container}>
				<MapView
					initialRegion={{
						...location,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
					style={styles.mapStyle}
					onPress={() => {
						this.setState({ isAddEvent: false });
					}}
				>
					{markers.map((el, id) => {
						const markerColor = el.status_id === 'b0Q7JzsYXBBeBLbG9nb0' ? 'red' : 'green';
						const isFellowship = el.classification_id === 'CIwRusFj5lv1Zt7FCXrp' ? true : false;
						const marker = {
							latlng: {
								latitude: el.location.lat,
								longitude: el.location.long,
							},
							title: el.title,
							description: el.description,
						};
						if (isFellowship) {
							return (
								<Marker
									key={id}
									coordinate={marker.latlng}
									pinColor={markerColor}
									title={marker.title}
									description={marker.description}
									onPress={() => this.setState({ details: el, showDetais: true })}
								>
									<Pin color={markerColor} />
								</Marker>
							);
						}
						return (
							<Marker
								key={id}
								coordinate={marker.latlng}
								pinColor={markerColor}
								title={marker.title}
								description={marker.description}
								onPress={() => this.setState({ details: el, showDetais: true })}
							/>
						);
					})}
				</MapView>
				{!showDetais && (
					<View style={styles.addContainer}>
						<Feather
							name="plus"
							size={32}
							color="#fff"
							onPress={() => {
								this.setState((prevState) => {
									return { isAddEvent: !prevState.isAddEvent };
								});
							}}
						/>
					</View>
				)}

				{showDetais && details && (
					<View
						style={{
							...styles.detailsContainer,
							backgroundColor: canceled ? '#FF0049' : '#00FB00',
						}}
					>
						<View>
							<Text style={styles.title}>{details.title}</Text>
							<Text style={styles.description}>{details.description}</Text>
							{!canceled && (
								<Text style={styles.dates}>
									<Text style={styles.label}>Starting date: </Text>
									{`${formatDate(details.starting_date.toDate())}`}
								</Text>
							)}
							{!canceled && (
								<Text style={styles.dates}>
									<Text style={styles.label}>End date: </Text>
									{`${formatDate(details.end_date.toDate())}`}
								</Text>
							)}
							{canceled && (
								<Text style={styles.dates}>
									<Text style={styles.label}>Status: </Text>Cancelled
								</Text>
							)}
						</View>
						<TouchableWithoutFeedback onPress={() => this.setState({ details: null, showDetais: false })}>
							<View style={styles.closeContainer}>
								<AntDesign name="close" size={32} color="#fff" />
							</View>
						</TouchableWithoutFeedback>
					</View>
				)}
				{isAddEvent && (
					<View style={styles.card}>
						<ScrollView>
							<View style={styles.cover}>
								<Text style={styles.text}>Title:</Text>
								<View style={styles.nameInput}>
									<TextInput
										onChangeText={(text) => this.setState({ title: text })}
										placeholder="Enter Name"
										style={styles.input}
										value={this.state.title}
									/>
								</View>
							</View>
							<View style={styles.cover}>
								<Text style={styles.text}>type:</Text>
								<RadioGroup
									style={{ flexDirection: 'row', marginTop: 5, padding: 5 }}
									defaultChoice={this.state.typeIndex}
									onChoose={(value, index) => this.setState({ type: value, typeIndex: index })}
								>
									<RadioButton
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'center',
										}}
										value={'fellowship'}
									>
										<Radio />
										<Text style={{ paddingHorizontal: 10, color: '#fff' }}>fellowship</Text>
									</RadioButton>
									<RadioButton
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'center',
										}}
										value={'function'}
									>
										<Radio />
										<Text style={{ paddingHorizontal: 10, color: '#fff' }}>function</Text>
									</RadioButton>
								</RadioGroup>
							</View>
							<View style={styles.cover}>
								<Text style={styles.text}>Details:</Text>
								<View style={styles.nameInput}>
									<TextInput
										onChangeText={(text) => this.setState({ eventDetails: text })}
										placeholder="Enter details"
										style={styles.input}
										value={this.state.eventDetails}
									/>
								</View>
							</View>
							<View style={styles.cover}>
								<Text style={styles.text}>Location:</Text>
								<View style={styles.nameInput}>
									<TextInput
										placeholder="choose Location"
										style={styles.input}
										value={this.state.address}
									/>
									<MaterialIcons
										style={styles.icon}
										name="location-on"
										onPress={() => {
											this.props.navigation.navigate('PickLocation');
										}}
										size={28}
										color="#fff"
									/>
								</View>
							</View>
							<View style={styles.btn}>
								<Button
									color="#850127"
									onPress={() => {
										addEventHandler();
									}}
									title="post"
								/>
							</View>
						</ScrollView>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	mapStyle: {
		width: '100%',
		height: '100%',
	},
	addContainer: {
		zIndex: 2,
		position: 'absolute',
		bottom: 40,
		right: 20,
		backgroundColor: '#4291ee',
		width: 50,
		height: 50,
		borderRadius: 25,
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
	},
	detailsContainer: {
		position: 'absolute',
		width: Dimensions.get('window').width - 20,
		bottom: 40,
		zIndex: 2,
		left: 0,
		marginHorizontal: 10,
		backgroundColor: '#00FB00',
		borderRadius: 5,
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		fontFamily: 'Roboto',
		fontSize: 15,
		fontWeight: '900',
		color: '#fff',
		marginBottom: 8,
	},
	label: {
		fontFamily: 'Roboto',
		fontSize: 14,
		color: '#fff',
		fontWeight: '900',
	},
	description: {
		fontFamily: 'Roboto',
		fontSize: 13,
		fontWeight: '300',
		color: '#fff',
		width: Dimensions.get('window').width - 100,
		marginBottom: 4,
	},
	dates: {
		fontFamily: 'Roboto',
		fontSize: 14,
		color: '#fff',
	},
	closeContainer: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
	},
	card: {
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.26,
		shadowRadius: 8,
		backgroundColor: 'rgba(0, 8, 228, 0.8)',
		height: Dimensions.get('window').height * 0.45,
		flexDirection: 'column',
		elevation: 5,
		borderRadius: 18,
		backgroundColor: 'rgba(0, 8, 228, 0.9)',
		zIndex: 999,
		position: 'absolute',
		bottom: 10,
	},
	content: {
		flexDirection: 'row',
		padding: 20,
	},

	nameInput: {
		flexDirection: 'row',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 5,
		width: '75%',
		marginTop: 5,
	},
	input: {
		flexGrow: 1,
		alignItems: 'center',
		borderRadius: 10,
		marginRight: 10,
		backgroundColor: 'rgba(0, 8, 228, 0.9)',
		flex: 1,
		padding: 5,
		fontSize: 16,
		lineHeight: 16,
		paddingLeft: 10,
		paddingTop: 6,
		paddingBottom: 6,
		paddingRight: 0,
		color: 'white',
		borderWidth: 0.8,
		borderColor: '#fff',
	},
	text: {
		fontSize: 16,
		padding: 10,
		color: '#fff',
		marginTop: 15,
	},
	cover: {
		flexDirection: 'row',
	},
	btn: {
		width: Dimensions.get('window').width * 0.4,
		borderRadius: 100,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.26,
		shadowRadius: 8,
		elevation: 5,
		marginLeft: Dimensions.get('window').width * 0.3,
		marginTop: 6,
	},
	icon: {
		padding: 5,
	},
});
