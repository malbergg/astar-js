<template>
  <div id="app">
    <div class="left-container">
    <table>
      <tr>
        <td class="coordinates" v-bind:style="{ flexBasis: cellWidth }"></td>
        <td v-for="y in sizeY" :key="y" class="coordinates" v-bind:style="{ flexBasis: cellWidth }">
          <div>{{y}}</div>
        </td>
      </tr>
      <tr v-for="x in sizeX" :key="x">
        <td class="coordinates" v-bind:style="{ flexBasis: cellWidth }">
          <div>{{ x }}</div>
        </td>
        <td v-for="y in sizeY" :key="y" @click="choose(x, y)" v-bind:style="{ flexBasis: cellWidth }">
          <div v-if="x == start.x && y == start.y" class="start">
            <div class="icon-container">
              <div class="icono-home"></div>
            </div>
            start
          </div>
          <div v-else-if="x == stop.x && y == stop.y" class="stop">
            <div class="icon-container">
              <div class="icono-flag"></div>
            </div>
            stop
          </div>
          <div v-else-if="isBarrier(x, y)" class="barrier">
            <div class="icon-container">
             <div class="icono-forbidden"></div>
            </div>
            bariera
          </div>
          <div v-else-if="isRoad(x, y)" class="road">
            <div class="icon-container">
              <div class="icono-pin"></div>
            </div>
            droga
          </div>
          <div v-else>
            {{y}}
          </div>
        </td>
      </tr>
    </table>
    </div>
    <div class="right-container">
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <div v-if="!start.x && !start.y" class="error">Wybierz start</div>
      <div v-else-if="!stop.x && !stop.y" class="error">Wybierz stop</div>
      <template v-else>
        <div>
          <button class="calculate" type="button" @click="calculateRoad">Oblicz drogę</button>
        </div>
        <div>
          <button class="reset" type="button" @click="reset">Resetuj</button>
        </div>
      </template>
      <div>
        <div v-if="start.x && start.y">
          <div>Współrzędne startu:</div>
          <div>{{start.x}}</div>
          <div>{{start.y}}</div>
        </div>
        <div v-if="start.x && start.y">
          <div>Współrzędne stopu:</div>
          <div>{{stop.x}}</div>
          <div>{{stop.y}}</div>
        </div>
        <div v-if="roadSize">
          <div>Ilość kroków:</div>
          <div>{{roadSize}}</div>
        </div>
      </div>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script>
import 'icono/dist/icono.min.css'
import Astar from './astar/astar'
import Point from './astar/point'

export default {
  name: 'app',
  components: {

  },
  data() {
    return {
      sizeX: 10,
      sizeY: 10,
      start: {
        x: null,
        y: null
      },
      stop: {
        x: null,
        y: null
      },
      barriers: [
      ],
      road: [],
      roadSize: 0,
      error: ''
    }
  },
  computed: {
    cellWidth: function() {
      return `${100/(this.sizeX+1)}%`
    }
  },
  methods: {
    choose(x, y) {
      if (!this.start.x && !this.start.y) {
        this.start.x = x;
        this.start.y = y;
      }
      else if (!this.stop.x && !this.stop.y) {
        if (this.start.x != x && this.start.y != y) {
          this.stop.x = x;
          this.stop.y = y;
          this.error = '';
        }
        else {
          this.error = 'Stop nie moze byc w punkcie start'
        }
      }
      else {
        if (x == this.start.x && y == this.start.y) {
          this.error = 'Bariera nie moze byc w punkcie start'
        }
        else if (x == this.stop.x && y == this.stop.y) {
          this.error = 'Bariera nie moze byc w punkcie stop'
        }
        else {
          this.error = '';
          let barrier = {
            x: x,
            y: y
          }
          this.barriers.push(barrier)
        }
      }
    },
    reset() {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    calculateRoad() {
      let astar = new Astar(this.sizeX, this.sizeY, this.start, this.stop, this.barriers)
      astar.calculateRoad()
      this.error = astar.error
      this.road = astar.roadCoordinates
      this.roadSize = this.road.length
    },
    isBarrier(x, y) {
      for (let barrier of this.barriers) {
        if (barrier.x == x && barrier.y == y) {
          return true
        }
      }
      return false
    },
    isRoad(x, y) {
      for (let element of this.road) {
        if (element.x == x && element.y == y) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style>
body {
  background-color: #f7f7f5;
  font-family: 'Mali', cursive;
}
button {
  color: white;
  width: 100%;
  padding: 10px 0px;
  text-transform: uppercase;
  cursor: pointer;
  border: 0px;
  border-radius: 0px;
}
.calculate {
  background-color: #2f85ae;
}
.reset {
  background-color: #D33C44;
}
div {
  box-sizing: border-box;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}
tr {
  display: flex;
  justify-content: center;
}
td {
  text-align: center;
  border: 1px solid #104048;
  cursor: pointer;
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
  font-size: 13px;
}
td:after {
  content: '';
  display: block;
  padding-bottom: 100%;
}
td > div {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}
.coordinates {
  background-color: #363638;
  color: white;
  border: 1px solid #bdbdb5;
}
.road {
  background-color: #2f85ae;
}
.barrier {
  background-color: #D33C44;
}
.start,
.stop {
  background-color: #23ce6b;
}
.icon-container {
  transform: scale(0.8);
}
.icono-home,
.icono-flag,
.icono-pin,
.icono-forbidden {
  color: white;
}
.left-container,
.right-container {
  float: left;
  padding: 10px;
}
.left-container {
  width: 75%;
  max-width: 100vh;
}
.right-container {
  width: 25%;
}
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
} 
.clearfix:after {
  clear: both;
}
.clearfix {
  zoom: 1;
}
.error {
  color: #D33C44;
  border: 1px solid #D33C44;
  padding: 10px;
  margin: 0px 0px 10px 0px;
  text-align: center;
}
</style>
