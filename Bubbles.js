class Bubbles {
  //constructor creates the object with its properties
  constructor(x, y, c, s) {
    this.x = x;
    this.y = y;
    this.c = c;
    this.s = s;
    this.size = random(10, 30);  //vary size of bubbles
  }

  //draw and display the bubble
  display() {
    strokeWeight(2);
    stroke(105, 222, 255);
    fill(this.c);
    ellipse(this.x, this.y, this.size);    //create image of bubble
  }

  //cause the bubble to move to the right
  move() {
    this.y -= this.s; //bubbles go up up up
    
    if (this.y < 0) {  //if bubbles exceed canvas by y-axis...
      this.y = random(465, width);    //...set them to a random value on bottom on canvas
    }
  }
}
