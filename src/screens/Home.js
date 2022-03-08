import React from 'react'
import { View, Text } from 'react-native'
import Bar from '../components/Bar'
import ShowMovies from '../components/ShowMovies';

export default function Home({navigation}) {
    return (
        <View style={{flex:1}}>
            <Bar/>
            <ShowMovies navigation={navigation}/>
        </View>
    )
}
