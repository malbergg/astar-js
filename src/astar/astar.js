import Point from './point'
import Node from './node'

class Astar {
    constructor(sizeX, sizeY, start, stop, barriers) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.start = start;
        this.stop = stop;
        this.barriers = barriers;
        this.openList = [];
        this.closedList = [];
        this.roadCoordinates = [];
        this.error = ''
    }

    setBarrier(x, y) {
        this.barriers.push(new Point(x, y))
    }

    isBarrier(x, y) {
        for (let barrier of this.barriers) {
            if (barrier.x == x && barrier.y == y) {
                return true
            }
        }
        return false
    }

    findClosest(point) {
        let closest = []

        if (point.x - 1 >= 1 && point.x - 1 <= this.sizeX) {
            if (!this.isBarrier(point.x - 1, point.y)) {
                closest.push(new Point(point.x - 1, point.y));
            }
        }
        if (point.x + 1 >= 1 && point.x + 1 <= this.sizeX) {
            if (!this.isBarrier(point.x + 1, point.y)) {
                closest.push(new Point(point.x + 1, point.y));
            }
        }
        if (point.y - 1 >= 1) {
            if (!this.isBarrier(point.x, point.y - 1)) {
                closest.push(new Point(point.x, point.y - 1));
            }
        }
        if (point.y + 1 <= this.sizeY) {
            if (!this.isBarrier(point.x, point.y + 1)) {
                closest.push(new Point(point.x, point.y + 1));
            }
        }

        return closest;
    }

    /*
    Metoda sprawdza czy dane koordynaty sa juz w liscie otwartej
    */
    checkInOpenList(point) {
        for (let element of this.openList) {
            if (element.point.x == point.x && element.point.y == point.y) {
                return true
            }
        }
        return false
    }

    checkInClosedList(point) {
        for (let element of this.closedList) {
            if (element.point.x == point.x && element.point.y == point.y) {
                return true
            }
        }
        return false
    }

    checkInRoadCoordinates(point) {
        for (let element of this.roadCoordinates) {
            if (element.x == point.x && element.y == point.y) {
                return true
            }
        }
        return false
    }

    findLowestFInOpenList() {
        let h = Infinity;
        let lowestF = null; 
        for (let element of this.openList) {
            if (element.h < h) {
                h = element.h
                lowestF = element
            }
        }

        return lowestF
    }

    setBoard() {
        for (i = 0; i < this.sizeX; i++) {
            for (j = 0; j < this.sizeY; i++) {

            }
        }
    }

    calculateRoad() {
        if (!this.start.x || !this.start.x) {
            this.error = "Wybierz punkt startu"
            return
        }
        if (!this.stop.y || !this.stop.y) {
            this.error = "Wybierz punkt stopu"
            return
        }
        this.openList.push(new Node(this.start, this.start, this.stop))
  
        let foundStop = false

        let lowestF

        let j = 0
        for (;;) {
            j++
            if (this.openList.length > 0) {
                lowestF = this.findLowestFInOpenList()
                if (lowestF.point.x == this.stop.x && lowestF.point.y == this.stop.y) {
                    foundStop = true
                    break
                }
                this.closedList.push(lowestF)
                this.removeFromOpenList(lowestF)

                let closest = this.findClosest(lowestF.point)

                for (let element of closest) {
                    if (!this.checkInOpenList(element) && !this.checkInClosedList(element)) {
                        this.openList.push(new Node(element, lowestF.point, this.stop))
                    }
                }
                continue
            }
            break
        }

        if (foundStop) {
            let current = this.closedList[this.closedList.length - 1]
            let parent = this.getParent(current.point)

            this.roadCoordinates.push(parent.point)
            let i = 0
            for (;;) {
                i++
                if (i > 100) {
                    alert("Blad")
                    break
                }
                parent = this.getParent(parent.parent)
                
                if (!parent) {
                    return console.log(this.closedList)
                }

                this.roadCoordinates.push(parent.point)
 
                if (parent.point.x == this.start.x && parent.point.y == this.start.y) {
                    break
                }
            }
        }
        else {
            this.error = "Droga nie została odnaleziona"
        }
    }

    getParent(node) {
        for (let element of this.closedList) {
            if (element.point.x == node.x && element.point.y == node.y) {
                return element
            }
        }
    }
    
    removeFromOpenList(point) {
        for (let element in this.openList) {
            if (this.openList[element].point.x == point.point.x && this.openList[element].point.y == point.point.y) {
                this.openList.splice(element, 1)
                break
            }
        }

        return;
    }
}
export default Astar