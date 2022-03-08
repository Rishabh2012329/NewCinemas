import { useContext, useState, useCallback } from 'react'
import axios from 'axios'
import {movieContext} from '../context/movie'
import {TMDB} from '@env'

function getMovies(){
    const {state,dispatch} = useContext(movieContext)
    const [cache,setCache] = useState({})
    
    let cancelToken;
    const update = useCallback(async (genre,page,dataToAdd)=>{
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB}&with_genres=${genre}&page=${parseInt(page)+1}`
        let d={};
        
        if(cache[genre]){
            if(cache[genre][page+1]){
                d.page= page+1
                d.movies=cache[genre][page+1]
                d.selectedGenre = genre
                dispatch({payload:d,type:"SET"})
                return;
            }
        }
        await axios.get(url).then((res)=>{
            d.page= res.data.page
            d.movies=res.data.results
            d.selectedGenre = genre
            if(cache[genre])
                cache[genre][page+1]=res.data.results
            else{
                cache[genre] = {}
                cache[genre][page+1] = res.data.results
            }
        }).catch(err=>console.log(err))
        dispatch({payload:{...d,...dataToAdd},type:"SET"})
    },[])

    const addNextPage= useCallback(async ()=>{
        const genre = state.selectedGenre
        const page = state.page
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB}&with_genres=${genre}&page=${parseInt(page)+1}`
         if(cache[genre]){
            if(cache[genre][page+1]){
                dispatch({payload:{movies:cache[genre][page+1],page:page+1},type:"ADD_MOVIES"})
                return;
            }
        }
        await axios.get(url).then((res)=>{
            if(cache[genre])
                cache[genre][page+1]=res.data.results
            else{
                cache[genre] = {}
                cache[genre][page+1] = res.data.results
            }
            dispatch({payload:{movies:res.data.results,page:page+1},type:"ADD_MOVIES"})
        }).catch(err=>console.log(err))
    },[state.page])

    const search=useCallback(async (search)=>{
        
        let url=`https://api.themoviedb.org/3/search/movie?api_key=${TMDB}&language=en-US&query=${search}&page=1`;

        // Cancelling Previous requests
        if(typeof cancelToken!==typeof undefined){
            await cancelToken.cancel("Cancelling Prev Requests")
        }
            cancelToken = axios.CancelToken.source();
        
        await axios.get(url,{cancelToken:cancelToken.token}).then((res)=>{
            console.log("response search",res.data)
            dispatch({payload:{searchPage:1,movies:res.data.results},type:"SET"})
        }).catch(err=>{
             if (axios.isCancel(err)) 
                 console.log('Request canceled '+search, err.message);
        })
    },[])

    const reset=useCallback(async (genre)=>{
        console.log("resetting")
        const page = state.page
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB}&with_genres=${genre}&page=${parseInt(page)}`
        if(typeof cancelToken!==typeof undefined){
            cancelToken.cancel("Cancelling Prev Request")
        }else{
            cancelToken = axios.CancelToken.source();
        }
        if(cache[genre]){
            
            if(cache[genre][1]){
               
                dispatch({payload:{movies:cache[genre][1],searchPage:0,page:1},type:"SET"})
                return;
            }
        }
        
    },[])
    return {
        update,
        addNextPage,
        search,
        reset
    }

}

export default getMovies