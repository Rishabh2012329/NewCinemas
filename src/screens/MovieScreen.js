import React,{useState,useEffect, useContext} from 'react'
import { View, Text, StyleSheet, ImageBackground, Pressable, FlatList, Image, ScrollView, ActivityIndicator, TouchableOpacity} from 'react-native'
import {TMDB} from '@env'
import axios from 'axios'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/dist/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoPlayer from 'react-native-video-player'
import shortid from 'shortid'
import { movieContext } from '../context/movie'
import theme from '../../theme'

const styles = StyleSheet.create({
    actor:{
        flexDirection:"column",
        alignItems:'center',
        margin:5
    },
    torrent:{
        flexDirection:"row",
        margin:5
    }
})

const Actor = ({item}) => {
    return (
   <View style={styles.actor}>
        <Image source={{uri:item.image}} style={{width:100,height:100,borderRadius:50}}/>
        <Text style={{color:"white"}}>{item.name}</Text> 
        <Text style={{color:"#b8b8b8"}}>{item.asCharacter}</Text> 
    </View>
)};

const Torrent = ({item}) => {
    return (
        <View style={styles.torrent}>
            <Text style={{color:"white"}}>{item.title}</Text>
        </View>
    )
}

export default function MovieScreen({navigation}) {
    const [movieState,setState] = useState({loading:true})
    const {state,dispatch} = useContext(movieContext)
    const storeData = async (key,data) =>{
        try {
            const jsonValue = JSON.stringify(data)
            await AsyncStorage.setItem(key+"", jsonValue)
        } catch (e) {
            console.log(e)
        }
    }
    const getData=async (key)=>{
        try {
            const value = await AsyncStorage.getItem(key+"")
            if(value !== null) {
              return value
            }
            return value
          } catch(e) {
            // error reading value
          }
    }
    const styles = StyleSheet.create({
        
        container:{
            flex:1,
        },
        down:{
            backgroundColor:"black",
            flex:1,
            
        },
        plot:{
            color:'white'
        },
        tag:{
            padding:2,
            borderRadius:10,
            alignSelf:"flex-start",
            paddingLeft:5,
            paddingRight:5,
            borderColor:"gray",
            borderStyle:"solid",
            borderWidth:1,
            margin:2,

        },
        tags:{
            flexWrap:"wrap",
            flexDirection:"row",
            alignItems:"center"
        },
        title:{
            color:"white",
            marginBottom:6,
            fontSize:22,
            fontWeight:"bold"
        },
        loading:{
            backgroundColor:"black",
            flex:1,
            justifyContent:"center",
            alignItems:"center"
        }
    })
    const Api = async ()=>{
        let id = state.modal.id
        console.log(id)
        
        let data =await getData(id)
            
        if(data!==null){
            data = JSON.parse(data)
            console.log(data.trailer)
            setState(data)
            console.log('Loaded Stored Data')
            
        }
        else{
        await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB}&language=en-US`).then(async (res)=>{
            setState(res.data)
            const options = {
                method: 'GET',
                url: 'https://imdb-api.com/en/API/Ratings/k_hymjroub/'+res.data.imdb_id,
              };
              let dat = {}
              await axios.request(options).then(function (response) {
                  dat.rating = response.data.theMovieDb
              }).catch(function (error) {
                  console.error(error.response);
              });
            await axios.get("https://imdb-api.com/en/API/FullCast/k_hymjroub/"+res.data.imdb_id).then(function (response) {
                dat.actors= response.data.actors
            }).catch(function (error) {
                console.error(error.response);
            });
            await axios.get("https://imdb-api.com/en/API/YouTubeTrailer/k_hymjroub/"+res.data.imdb_id).then(function (response) {
                dat.trailer= response.data.videoId
                
            }).catch(function (error) {
                console.error(error.response);
            });
            
            setState({...res.data,...dat})
            storeData(id,{...res.data,...dat})
        }).catch(err=>console.log(err))
        }
        axios.post("https://torrent-scraper-1.herokuapp.com/getMagnet",{name:data?.title+" "+new Date(data?.release_date).getFullYear()}).then((res)=>{
                setState({...data,torrents:res.data})
                console.log(res.data)
            }).catch(err=>{
                console.log("Torrent Error:",err)
            })
    }
    useEffect(()=>{
        Api()
        return () => {
            setState({});
        };
    },[])
    const onClick = (magnet) =>{
        dispatch({type:"SET",payload:{magnet:magnet}})
        state.navigation.navigate('Torrent')
    }
    return (
        movieState.loading?<View style={styles.loading}><ActivityIndicator size="large" color={theme[state.theme].barColor} /></View>:
        <ScrollView style={styles.container}>
            <ImageBackground style={{height:375}} source={{uri:"http://image.tmdb.org/t/p/w500"+movieState?.backdrop_path}}>
                <LinearGradient style={styles.container} colors={["rgba(0,0,0,0)","black"]}>
                    <Pressable onPress={()=>navigation.goBack()}>
                        <Text style={{color:"white",marginTop:10,marginLeft:7}}>
                            <Icon name="left" size={20} />
                        </Text>
                    </Pressable>
                </LinearGradient>
            </ImageBackground>
            <View style={styles.down}>
                <View>
                    <Text style={styles.title}>{movieState?.title}</Text>
                </View>
                <View style={styles.tags}>
                    {
                        movieState.genres?.map(obj=><View Key={shortid()} style={styles.tag}>
                            <Text style={{color:"white"}}>{obj.name}</Text>
                        </View>)
                    }
                    <Text style={{color:"white",marginLeft:7}}>{movieState.rating}</Text>
                    <Icon name="star" size={20} color={"#f7d128"} style={{marginLeft:3}} />
                </View>
                <View>
                    <Text style={{...styles.title,marginTop:10,marginBottom:10}}>Plot</Text>
                    <Text style={styles.plot}>
                        {movieState.overview}
                    </Text>
                </View>
                <Text style={{...styles.title, marginTop:10,marginBottom:8}}>Actors</Text>
                <FlatList
                    data={movieState.actors||[]}
                    keyExtractor={item => shortid()}
                    horizontal={true}
                    renderItem={Actor}
                />
                <Text style={{...styles.title, marginTop:10,marginBottom:8}}>Torrents</Text>
                {
                    movieState?.torrents?.map((item)=>{
                        return (
                            <TouchableOpacity onPress={()=>onClick(item.magnetUrl)}>
                                <Torrent item={item} key={shortid()}/>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        </ScrollView>
    )
}
