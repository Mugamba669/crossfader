<template>
  <div class="player">
    <div class="utils">
        <p> Freq <input type="range" max="20000" min="10" v-model="freq" @input="updateFreq" step="5"/> {{freq}}</p>
      <p> Q <input type="range" max="6" min="-6" step="0.01" v-model="q" @input="updateQ"/> {{q}}</p>
      <p> Gain <input type="range" max="25" min="0" v-model="gain" @input="updateGain" step="0.01"/> {{gain}}</p>
      <p> Volume <input type="range" max="1" min="0" v-model="vol"  @input="updateVol" step="0.01"/> {{Number(vol).toFixed(1)}}</p>
    <p> <input type="file" @change="loadSongs" webkitdirectory/></p>
    <p></p>
    </div>
    <div class="playlist">
   <p class="track" v-for="(song,index) in songs" :key="song.id" @click="playSong(song,index)">{{song.id}}. {{song.name}} </p>
</div>
  
  
  </div>
</template>

<script>
const {  readFileSync, writeFileSync } = require('fs');
const { homedir }  = require('os');
const {Equalizer} = require("../Core/Equalizer.js")
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    // console.log(new Eq());
    return {
      songs: JSON.parse(readFileSync(`${homedir()}/music.json`)),
      songId:0,
      audios:[],
      vol:0.4,
      playNow:false,
      global:null,
      gain:0,
      q:0,
      freq:0,eq:null
    }
  },
  computed:{

  },
 
  methods: {
   /**
    * @param { HTMLFileElement } e 
    */
    loadSongs(e){
          var files = e.currentTarget.files;
      for (const key in files) {
        if (Object.hasOwnProperty.call(files, key)) {
          const element = files[key];
          let data = {
            id:key,
            url: `${URL.createObjectURL(element)}`,
            name:element.name
          }

          this.songs = [...this.songs, data]
          writeFileSync(`${homedir()}/music.json`,JSON.stringify(this.songs));
         }
        }
      
    },
    /**
     * @param { HTMLAudioElement } audio
     * @param { Number } id
     */
    crossFade(audio, id){
      this.global = audio;
     this.eq = new Equalizer(audio);
     this.eq.startEq();

    audio.volume = 0.4;
      audio.play();
          audio.ontimeupdate = ()=> {
        /**Display the track's current time */
       const min = Math.floor((audio.currentTime / 60) % 60)
       const sec = Math.floor(audio.currentTime % 60 );
       this.curlTime = sec < 10 ? min+":0"+sec:min+":"+sec;
/**Display the track duration */
       const dmin = Math.floor(((audio.duration - audio.currentTime) / 60) % 60)
       const dsec = Math.floor((audio.duration - audio.currentTime) % 60 );
       this.durlTime = dsec < 10 ?dmin+":0"+dsec:dmin+":"+dsec;
    /**Logic for next track */
     const monitor = Math.floor((audio.duration) -audio.currentTime);
        console.log(monitor);
        if(monitor == 40){
          let i = this.vol;
          let iter = setInterval(()=>{
            i-= 0.001;
            if(i.toFixed(2) == 0.00){
              clearInterval(iter);
              audio.load();
            }else{
              audio.volume = i;
            }

          },100);
              this.crossFade(this.audios[id + 1], id + 1);

            }
     }
    },
    updateVol(){
        this.global.volume = this.vol;
    },
     updateFreq(){
      this.eq.getParametric().frequency.value = this.freq;
    },
    updateQ(){
      console.log(this.eq)
        this.eq.getParametric().Q.value = this.q;
    },
    updateGain(){
      this.eq.getParametric().gain.value = this.gain;
    },
    /**
     * @param { } music
     */
    playSong(music,id){
      this.songId = id;
      if(this.audios.length == 0){
          for (let index = 0; index < this.songs.length; index++) {
            this.audios = [...this.audios, new Audio(`${this.songs[index].url}`)];
          }
      this.audios.forEach((s,ind) => (ind != id)?this.audios[ind].load():this.crossFade(this.audios[id],id));

      }else{
      this.audios.forEach((s,index) => (index != id)?this.audios[index].load():this.crossFade(this.audios[id],id));

      }
      // const audio = music.url;
      

    
    },
    
  },
   created(){
    
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.player{
  display:flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center!important;
  width:100%;
  .utils{
    width: 100%;
    padding: 10px;
    background:#adbbb5;
    margin: 10px;
  }
  .playlist{
    margin: 10px;
    width: 100%;
      background: #466e69;
    padding: 10px;
    height:230px!important;
    overflow: scroll;
        .track {
          font: 200 18px Ubuntu,Arial;
      width: 90%;
      background: #d6d6d6;
      border-radius: 5px;
      padding: 10px;
      cursor: pointer;
      box-shadow: -2px 0px 0px 1px #adbbb5;
      transition: 0.3s ease-in-out;
      margin: 10px;
      &:hover{
          box-shadow: -2px 0px 0px 1px #42b983;
      }
    }
  }
}

input[type="range"]{
  width: 80%;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
