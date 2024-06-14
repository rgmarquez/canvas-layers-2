# canvas-layers-2

A simple example of using HTML5 canvases and zIndex to draw two moving circles, one behind HTML text, and on in front of HTML text.

I wrote this code back in June 2, 2018; it uses old style JavaScrip conventions, including defining classes using functions and prototypes.

I use two canvases, one with a positive zIndex and one with a negative zIndex to draw two moving corcles, one behind the HTML text, and one in front of the HTML text.

The two circles move left to right and right to left to demonstrate the Z sorting with the text and each other.

Scrolling is supposed to keep the circles in the same position as the text is scrolled between them and the current implementation worked well in Safari, Firefox, and Chrome circa 2018.  However, the code now seems to have "stuttering" problems as you stroll up and down quickly in modern (2024) Safari, which I will debug soon.

![Screenshot 2024-06-13 at 7 46 07 PM](https://github.com/rgmarquez/canvas-layers-2/assets/943586/c2684253-e953-444e-b706-034c1eb5c78b)
