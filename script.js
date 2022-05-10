class Boid {
    constructor(boidElem) {
        this.boidElem = boidElem
        this.reset()
    }

    get x() {
        return parseFloat(getComputedStyle(this.boidElem).getPropertyValue("--x"))
    }

    set x(value) {
        this.boidElem.style.setProperty("--x", value)
    }

    get y() {
        return parseFloat(getComputedStyle(this.boidElem).getPropertyValue("--y"))
    }

    set y(value) {
        this.boidElem.style.setProperty("--y", value)
    }

    get angle() {
        return parseFloat(getComputedStyle(this.boidElem).getPropertyValue("--angle"))
    }

    set angle(value) {
        this.boidElem.style.setProperty("--angle", value)
    }

    convert_angle(angle) {
        var range_angle = ((angle % (2*Math.PI)) + (2*Math.PI)) % (2*Math.PI)

        if (range_angle > Math.PI) {
            range_angle -= (2*Math.PI)
        }

        if (range_angle > Math.PI) {
            console.log("Oof")
        }

        return range_angle
    }

    reset() {
        this.x = Math.random() * 100
        this.y = Math.random() * 100
        this.velo_x = Math.random() - 0.5
        this.velo_y = Math.random() - 0.5
        this.angle = Math.atan(this.velo_y/this.velo_x)
        this.speed = 0.1

        //RGB color
        const r = 0   + (Math.random() * 60)
        const g = 153 + (Math.random() * 2 * 30) - 30
        const b = 255 - (Math.random() * 60)
        this.boidElem.style.color = "rgb("+r+","+g+","+b+")"
    }

    update(delta, boids) {
        //Turning randomly
        /*
        if (Math.random() < (0.001 * delta)) {
            this.turn = 0.01
        }
        else if (Math.random() < (0.001 * delta)){
            this.turn = -0.01
        }

        else if (Math.random() < (0.002 * delta)){
            this.turn = 0
        }
        */
        this.turn = 0
        var boids_found = 0
        var average_diff_x = 0
        var average_diff_y = 0
        var average_diff_velo_x = 0
        var average_diff_velo_y = 0
        var average_x = 0
        var average_y = 0
        boids.forEach(boid => {
            var x_dist = (this.x - boid.x) / window.innerWidth * 100
            var y_dist = (this.y - boid.y) / window.innerHeight * 100

            if ((x_dist != 0 && y_dist != 0)
            && ((Math.pow(x_dist, 2) + Math.pow(y_dist, 2)) < 4)) {
                boids_found += 1

                //Avoid other boids
                average_diff_x += this.x - boid.x
                average_diff_y += this.y - boid.y

                //Match direction of other boids
                //Equivalent to matching velocity vectors
                average_diff_velo_x += this.velo_x - boid.velo_x
                average_diff_velo_y += this.velo_y - boid.velo_y

                //Go towards center of flock
                average_x -= boid.x
                average_y -= boid.y
            }
        });
        
        //Average and scale everything
        if (boids_found != 0) {
            this.velo_x += average_diff_x / boids_found * 1000
            this.velo_y += average_diff_y / boids_found * 1000

            this.velo_x += average_diff_velo_x / boids_found * 0.9
            this.velo_y += average_diff_velo_y / boids_found * 0.9

            this.velo_x += average_x / boids_found * 1000
            this.velo_y += average_y / boids_found * 1000
        }

        //Update

        var normalize = Math.sqrt(Math.pow(this.velo_x, 2) + Math.pow(this.velo_y, 2))
        var velo = normalize/10000000

        //Rescale velocity vector
        this.velo_x /= velo * 4
        this.velo_y /= velo * 4

        normalize = Math.sqrt(Math.pow(this.velo_x, 2) + Math.pow(this.velo_y, 2))
        velo = normalize/10000000

        this.x += this.velo_x * this.speed * delta / window.innerWidth * 100 / normalize
        this.y += this.velo_y * this.speed * delta / window.innerHeight * 100 / normalize
        
        //Convert angle to be from -pi to pi
        if (this.velo_x >= 0) {
            this.angle = Math.atan(this.velo_y/this.velo_x)
        }
        else {
            this.angle = Math.PI + Math.atan(this.velo_y/this.velo_x)
        }

        //Wrap around screen
        if ((this.x <= -2.5) || (this.x >= 102.5)) {
            this.x = (this.x % 105 + 105) % 105
        }

        if ((this.y <= -2.5) || (this.y >= 102.5)) {
            this.y = (this.y % 105 + 105) % 105
        }

    }
}

class SpecialBoid {
    constructor(boidElem) {
        this.boidElem = boidElem
        this.reset()
    }

    get x() {
        return parseFloat(getComputedStyle(this.boidElem).getPropertyValue("--x"))
    }

    set x(value) {
        this.boidElem.style.setProperty("--x", value)
    }

    get y() {
        return parseFloat(getComputedStyle(this.boidElem).getPropertyValue("--y"))
    }

    set y(value) {
        this.boidElem.style.setProperty("--y", value)
    }

    get angle() {
        return parseFloat(getComputedStyle(this.boidElem).getPropertyValue("--angle"))
    }

    set angle(value) {
        this.boidElem.style.setProperty("--angle", value)
    }

    convert_angle(angle) {
        var range_angle = ((angle % (2*Math.PI)) + (2*Math.PI)) % (2*Math.PI)

        if (range_angle > Math.PI) {
            range_angle -= (2*Math.PI)
        }

        if (range_angle > Math.PI) {
            console.log("Oof")
        }

        return range_angle
    }

    reset() {
        this.x = 50
        this.y = 50
        this.velo_x = Math.random() - 0.5
        this.velo_y = Math.random() - 0.5
        this.angle = Math.atan(this.velo_y/this.velo_x)
        this.speed = 0.1

        //RGB color
        const r = 255   + (Math.random() * 60)
        const g = 0 + (Math.random() * 2 * 30) - 30
        const b = 0 - (Math.random() * 60)
        this.boidElem.style.color = "rgb("+r+","+g+","+b+")"
    }

    update(delta, boids) {
        //Turning randomly
        /*
        if (Math.random() < (0.001 * delta)) {
            this.turn = 0.01
        }
        else if (Math.random() < (0.001 * delta)){
            this.turn = -0.01
        }

        else if (Math.random() < (0.002 * delta)){
            this.turn = 0
        }
        */
        this.turn = 0
        var boids_found = 0
        var average_difference_x = 0
        var average_difference_y = 0
        boids.forEach(boid => {
            var x_dist = (this.x - boid.x) / window.innerWidth * 100
            var y_dist = (this.y - boid.y) / window.innerHeight * 100

            if ((x_dist != 0 && y_dist != 0)
            && ((Math.pow(x_dist, 2) + Math.pow(y_dist, 2)) < 3)) {
                boids_found += 1

                //Avoid other boids
                average_difference_x += this.x - boid.x
                average_difference_y += this.y - boid.y
            }
        });
        
        if (boids_found != 0) {
            //console.log(average_difference_x)
            this.velo_x += average_difference_x / boids_found * 15000
            this.velo_y += average_difference_y / boids_found * 15000
        }

        //Favor the center
        this.velo_x += (50 - this.x) * 6500
        this.velo_y += (50 - this.y) * 6500

        //Update

        var normalize = Math.sqrt(Math.pow(this.velo_x, 2) + Math.pow(this.velo_y, 2))
        var velo = normalize/10000000

        // Max and min velocity
        this.velo_x /= velo * 5
        this.velo_y /= velo * 5

        normalize = Math.sqrt(Math.pow(this.velo_x, 2) + Math.pow(this.velo_y, 2))
        velo = normalize/10000000

        this.x += this.velo_x * this.speed * delta / window.innerWidth * 100 / normalize
        this.y += this.velo_y * this.speed * delta / window.innerHeight * 100 / normalize
        
        //Convert angle to be from -pi to pi
        if (this.velo_x >= 0) {
            this.angle = Math.atan(this.velo_y/this.velo_x)
        }
        else {
            this.angle = Math.PI + Math.atan(this.velo_y/this.velo_x)
        }

        //Wrap around screen
        if ((this.x <= -2.5) || (this.x >= 102.5)) {
            this.x = (this.x % 105 + 105) % 105
        }

        if ((this.y <= -2.5) || (this.y >= 102.5)) {
            this.y = (this.y % 105 + 105) % 105
        }

    }
}

var window_size = window.innerWidth * window.innerHeight
var boid_num = Math.min(Math.floor(window_size * 20 / 1032480), 40)

const boids = []
for (let i = 0; i < boid_num; i++) {
    boids[i] = new Boid(document.getElementById("boid" + i))
}

boids[40] = new SpecialBoid(document.getElementById("boid25"))

let lastTime
function update(time) {
    if (lastTime != null) {
        const delta = time - lastTime
        //updates
        boids.forEach(boid => {
            boid.update(delta, boids)
        });
    }

    lastTime = time
    window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)
