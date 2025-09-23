import * as Location from 'expo-location';

export const useCurrentPosition = async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // setErrorMsg('Permission to access location was denied');
        return;
      }
      
      return await Location.getCurrentPositionAsync({});
   
    }
    
 
