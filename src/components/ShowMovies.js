import React, { useContext, useState, useMemo,useEffect } from 'react'
import {FlatList, View, Text, Image, StyleSheet, Modal, Pressable, TouchableOpacity,ActivityIndicator} from 'react-native'
import { movieContext } from '../context/movie'
import getMovies from '../hooks/getMovies'
import {Link} from 'react-router-native'
import GestureRecognizer from 'react-native-swipe-gestures';
import Draggable from 'react-native-draggable'
import MovieScreen from '../screens/MovieScreen'
import theme from '../../theme'
import shortid from 'shortid'
import FastImage from 'react-native-fast-image'


const Item = React.memo(({item}) =>{

    const {state,dispatch} = useContext(movieContext)
    return <TouchableOpacity  activeOpacity={0.6} style={{flex:1}} onPress={()=>{dispatch({type:"SET",payload:{modal:{visible:true,id:item.id}}})
        state.navigation.navigate("Movie")
    }}>
            <View  style={styles.imageContainer}>
                    <FastImage style={styles.image} source={{uri:"http://image.tmdb.org/t/p/w154" + item.poster_path}} />
                <View style={styles.textComponent}>
                        <Text numberOfLines={2} style={styles.text}>{item.title} </Text>
                        <Text style={styles.text}>{item.release_date}</Text>
                    </View>
                </View>
        </TouchableOpacity>
})

const renderItem = ({item}) => {
   
        return (
            <Item item={item}/>
        )
}


const yourItemHeight = 200
const getItemLayout = (data, index) => (
    {length: yourItemHeight, offset:yourItemHeight * index, index}
);
function ShowMovies({navigation}) {
    const {state,dispatch} = useContext(movieContext)
    const [modal,setModal] = useState({visible:false})
    const {addNextPage,search} = getMovies()
    useEffect(() => {
        dispatch({type:"SET",payload:{navigation:navigation}})
    }, [])
    return (
        state.movies?<View style={{flex:1,backgroundColor:theme[state.theme].backgroundColor}}>
            <FlatList
                data={state.movies||[]}
                renderItem={renderItem}
                numColumns={3}
                onEndReached={()=>addNextPage()}
                onEndReachedThreshold={0.8}
                getItemLayout={getItemLayout}
                initialNumToRender={12}
                maxToRenderPerBatch={12}
                windowSize={12}
                
            />
            
        </View>:<View style={{flex:1,justifyContent:'center',backgroundColor:"rgba(0,0,0,0.7)"}}>
            <ActivityIndicator size="large" color={theme[state.theme].barColor} />
        </View>
    )
}

const styles = StyleSheet.create({
        container:{
            marginTop:4,
            width:"100%"
        },
        image: {
            width:"100%",
            height: "100%",
        },
        imageContainer:{
            flex:1,
            position:"relative",
            height:200,
            padding:4
        },
        text:{
            color:"white",
            fontWeight:"bold",
            textAlign:"justify",
            marginLeft:2
        },
        textComponent:{
            width:"100%",
            position:"absolute",
            backgroundColor:"rgba(0,0,0,0.7)",
            bottom:0
        }
    });


    export default React.memo(ShowMovies)