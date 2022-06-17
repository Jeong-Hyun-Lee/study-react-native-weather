import { StatusBar } from 'expo-status-bar'
import { Fontisto } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'

const { width: screenWidth } = Dimensions.get('window')

const API_KEY = '4434891d2acd9ab17d15cc63b6163cc5'

const icons = {
  Clouds: 'cloudy',
  Rain: 'rains',
  Clear: 'day-sunny',
  Atmosphere: 'cloudy-gusts',
  Snow: 'snow',
  Drizzle: 'rain',
  Thunderstrom: 'lightning',
}

export default function App() {
  const [city, setCity] = useState('Loading...')
  const [ok, setOk] = useState(true)
  const [days, setDays] = useState([])
  const getWeather = async () => {
    let { granted } = await Location.requestForegroundPermissionsAsync()

    if (!granted) {
      setOk(false)
    }

    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    )
    setCity(location[0].city)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&units=metric&appid=${API_KEY}`
    )
    const json = await response.json()
    setDays(json.daily)
  }

  useEffect(() => {
    getWeather()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color='#fff'
              style={{ marginTop: 10 }}
              size='large'
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color='black'
                />
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style='auto' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd400',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 68,
    fontWeight: '500',
  },
  weather: {},
  day: {
    width: screenWidth,
    padding: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 90,
    fontWeight: '500',
  },
  description: {
    fontSize: 40,
  },
  tinyText: { fontSize: 20 },
})
