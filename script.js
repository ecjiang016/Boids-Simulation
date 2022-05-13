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

    //Rescale y so units match up in JS code
    get y() {
        return parseFloat(getComputedStyle(this.boidElem).getPropertyValue("--y") * window.innerHeight / window.innerWidth)
    }

    set y(value) {
        this.boidElem.style.setProperty("--y", value * window.innerWidth / window.innerHeight)
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
        this.y = Math.random() * 100 * window.innerHeight / window.innerWidth //Scale to fit screen
        this.velo_x = Math.random() - 0.5
        this.velo_y = Math.random() - 0.5
        const init_velo_norm = Math.sqrt(Math.pow(this.velo_x, 2) + Math.pow(this.velo_y, 2))
        this.velo_x /= init_velo_norm
        this.velo_y /= init_velo_norm
        //this.angle = Math.atan(this.velo_y/this.velo_x)
        this.speed = 0.02

        //Randomly vary RGB color
        const r = 0   + (Math.random() * 60)
        const g = 153 + (Math.random() * 2 * 30) - 30
        const b = 255 - (Math.random() * 60)
        this.boidElem.style.color = "rgb("+r+","+g+","+b+")"
    }

    update(delta, boids) {
        this.turn = 0
        var boids_found = 0
        var average_diff_x = 0
        var average_diff_y = 0
        var average_diff_velo_x = 0
        var average_diff_velo_y = 0
        var average_x = 0
        var average_y = 0
        var average_x_diff = 0
        var average_y_diff = 0
        var norm

        boids.forEach(boid => {
            var x_dist = (this.x - boid.x)
            var y_dist = (this.y - boid.y)

            if ((x_dist != 0 && y_dist != 0)
            && ((Math.pow(x_dist, 2) + Math.pow(y_dist, 2)) < 70)) {

                //Avoid other boids
                average_diff_x += x_dist * 5
                average_diff_y += y_dist * 5

                //Match direction of other boids
                //Equivalent to matching velocity vectors
                average_diff_velo_x += (boid.velo_x - this.velo_x) * 8
                average_diff_velo_y += (boid.velo_y - this.velo_y) * 8

                //Go towards center of flock
                boids_found += 1
                average_x += boid.x
                average_y += boid.y
            }
        });

        //Average the averages
        if (boids_found != 0) {
            average_x_diff = ((average_x/boids_found) - this.x) * 15
            average_y_diff = ((average_y/boids_found) - this.y) * 15
        }

        //Update
        this.velo_x += (average_diff_x + average_diff_velo_x + average_x_diff) / 1000
        this.velo_y += (average_diff_y + average_diff_velo_y + average_y_diff) / 1000

        //Turning randomly
        this.velo_x += (Math.random() - 0.5) / 10
        this.velo_y += (Math.random() - 0.5) / 10

        //Noramlize velocity vector
        norm = Math.sqrt(Math.pow(this.velo_x, 2) + Math.pow(this.velo_y, 2))
        this.velo_x /= norm
        this.velo_y /= norm

        this.x += this.velo_x * this.speed * delta
        this.y += this.velo_y * this.speed * delta
        
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
var boid_num = Math.min(Math.floor(window_size * 40 / 1032480), 40)

const boids = []
for (let i = 0; i < boid_num; i++) {
    boids[i] = new Boid(document.getElementById("boid" + i))
}

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
