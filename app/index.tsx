
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Map from '@/components/Map';
import { useCurrentPosition } from '@/hook/location';


export default function Index() {
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    async function getCurrentLocation() {
      setLoading(true)
      
      let location = await useCurrentPosition();
      setLocation(location as Location.LocationObject);
      setLoading(false)
    }
    
    getCurrentLocation();
  }, []);
  return (
    <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
    >
    { isLoading ? 
      <View>
      <ActivityIndicator size="small" color="#0000ff" />
      </View>: <><View>
      {location && <><Text>
        long: {location?.coords.longitude}
        </Text>
        <Text>
        lat: {location?.coords.latitude}
        </Text></>}
        </View>
        <View style={{padding: 40, paddingTop: 100}}>
        </View></>}
        {location && (
          <View style={{ flex: 1, alignSelf: 'stretch', width: '100%' }}>
            <Map
              latitude={location.coords.latitude}
              longitude={location.coords.longitude}
            />
          </View>
        )}
        </View>
      );
    }
    