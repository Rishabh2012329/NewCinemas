import React,{useEffect,useContext,useRef} from 'react'
import { View, Text, StyleSheet, Image, TextInput } from 'react-native'
import {movieContext} from '../context/movie'
import axios from 'axios'
import {TMDB} from '@env'
import {Picker} from '@react-native-picker/picker'
import theme from '../../theme'
import getMovies from '../hooks/getMovies'
import MenueIcon from '../assests/list.png'
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import IconAnt from 'react-native-vector-icons/dist/AntDesign';
import CircleTransition from 'react-native-circle-reveal-view';


export default function Bar() {
    const {state,dispatch} = useContext(movieContext)
    const {update,search,reset} = getMovies()
    let transitedView;
    let cancelToken;
    const styles = StyleSheet.create({
        bar:{
            backgroundColor:theme[state?.theme].barColor,
            width:"100%",
            flexDirection:"row",
            alignItems: 'center',
            paddingRight:2,
            paddingLeft:2
        },
        dropdown:{
            flex:1
        },
        menueIcon:{
            width:30,
            height:"50%"
        }
    })
    const onChangeHandler =async (text) =>{
        search(text)
    }
    useEffect(()=>{
        axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB}&language=en-US`).then(res=>{
         dispatch({payload:res.data,type:"SET"})
         update(res.data.genres[0].id,0,res.data)
        }).catch(err=>console.log(err))
    },[])
    const circleRevelStart = () => {
        transitedView.toggle()
    }
    const circleRevelBack = () => {
        
        reset(state.selectedGenre)
        transitedView.toggle()
    }
    
    return (
        <View style={styles.bar}>
            <Icon name={"bars"} size={25} style={{marginLeft:10}}/>
            <Picker style={styles.dropdown} mode="dropdown" selectedValue={state?.selectedGenre||0} onValueChange={(itemValue)=>{
                dispatch({payload:{selectedGenre:itemValue},type:"SET"})
                update(itemValue,0,{})
                }}>
                {
                    state?.genres?.map((obj)=>{
                        return <Picker.Item label={obj.name} value={obj.id} key={obj.id} />
                    })
                }
            </Picker>
            <Icon name={"search"} onPress={circleRevelStart} size={25} style={{marginRight:10}}/>
            <CircleTransition
                ref={(ref) => transitedView = ref}
                backgroundColor={'white'}
                duration={400}
                style={{position: 'absolute', bottom: 0, right: 0, left: 0,top:0}}
                revealPositionArray={{bottom:true,right:true}}// must use less than two combination e.g bottom and left or top right or right
            >
            <View style={{width:"100%",height:"100%",backgroundColor:"white",alignItems:"center",flexDirection:"row",padding:5}}>
                    <IconAnt name={"arrowleft"} size={25} onPress={circleRevelBack}/>
                    <TextInput placeholder="Search" style={{height:"100%",width:"100%",fontSize:17}} onChangeText={onChangeHandler}/>
            </View>
        </CircleTransition>
        </View>
    )
}

