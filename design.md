# Graph Based Map Generation

## Introduction

We can consider several approaches to generate content:

- When constructing an environment out of tiles, try using nonstandard shapes instead of squares.
IMPORTANT: Herringbone Wang tiles are a great example. This method is not too hard to implement.
- When creating heightmaps or other maps with Perlin or other kinds of noise, try multiplying each pixel by several layers of other noise. Which also multiplied by a scalar to adjust the other noises' intensity.
IMPORTANT: By this way we can break the repeating patterns.