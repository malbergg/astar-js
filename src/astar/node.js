class Node
{
	constructor(point, parent, stop) {
        this.point = point;
        this.stop = stop;
        // droga przebyta od poczatku
        this.g = parent.g ? parent.g : 0 + 1;
        // heurystyka, droga do konca
        this.h = this.calculateH(point);
        // koszt
        this.f = this.g + this.h;
        // rodzic
        this.parent = parent;
    }
    
    calculateH(point) {
        return Math.abs(this.stop.x - point.x) + Math.abs(this.stop.y - point.y)
    }
}
export default Node