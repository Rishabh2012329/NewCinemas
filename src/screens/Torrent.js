import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import VideoPlayer from 'react-native-video-player'
import {movieContext} from '../context/movie'

export default function Torrent() {
    const [localState,setState] = useState({})
    const {state,dispatch} = useContext(movieContext)
    useEffect(()=>{
        console.log(state.magnet)
        axios.post(`https://torrent-stream-1.herokuapp.com/api/torrents?torrent=${encodeURIComponent(state.magnet.trim())}`).then(res=>{
            setState({...res.data})
        }).catch(err=>{
            console.log("Error",err)
        })
    },[])
  return (
    <View>
      <Text>Torrent</Text>
      {
          localState.files?.map((obj)=>{
              return (
                  <TouchableOpacity onPress={()=>setState({...localState,selectedTorrent:obj.stream})}>
                      <Text>{obj.name}</Text>
                  </TouchableOpacity>
              )
          })
      }
      {localState.selectedTorrent&&<VideoPlayer
        videoWidth={400}
        videoHeight={300}
        video={{uri:localState.selectedTorrent}}
        fullscreen={true}
        resizeMode="cover"
        controls={true}
        fullscreenOrientation="landscape"
        
      />}
    </View>
  )
}