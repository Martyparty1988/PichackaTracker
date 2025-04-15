// Tato knihovna obsahuje zvuky pro aplikaci
// Zvuky jsou zakódovány přímo do kódu jako Base64 string, aby nebylo třeba
// stahovat externí soubory - toto zlepší odezvu a rychlost načítání

// Zvuk pro start časovače
export const playStartSound = () => {
  try {
    // Krátký pípnutí/ping pro spuštění časovače
    const audio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbMAYGBgYGBgYGBgYGBgYGBgYGBgj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj7Kysry8vLy8vLy8vLy8vLy8vLy84ODg4ODg4ODg4ODg4ODg4ODg////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQCkAAAAAAAAAGzp0V2KQAAAAAAAAAAAAAAAAAAAAAA/+MYxAANABpYKUEQAABJwgDoC27///2aff/+31P/f//uev//08e9/vfq/v+v3v/3////////17/0U+1E+1Kp9KVSqf/X/R+qf////6p/wgsF/////8E///0ZkiISz41hPKzNGxkkiSwJLKLGnRMNIkv/FDgcBigAABEPigQDAh/BILFAYiQ8vFgMvqAQmKyWSRBFCAnwmGQYQA0XBJQeDQkiO1DiY3GQzAFiOYeDYLDYuARXMgQ3BEISGA30z+r9N///NWZtVqxBhSDVQBk0t1uMdOjQscdT4AkQIB/8fRjG6kAQhuJI6wBvs44v/jvxCQAEzNKjD/+MYxCgYU0qYAZqQAN2/vFgMvj9Xz96sBxkSc6ULLYlBQDRcCVQB2EIEXB3AYhyETB40LgpkMhKi4EYyKQYRmEpKZgGFwlBxiJCTRIZHBaHqVX9v0/U/N0bWKXy3XWYyQhoBTRa2SXqk1KnQqDwOApDwGXzRq8dVs3GPmv//Y9jGcYxtVg6EUGBwJjYPAQIA0JAjCkJQ5B4E4QgaDADwNBcBILhTmZk4//7XdMuFsQxF9nW1XHQz5YPJ/+MYxA4W22K0AY94AKnNx3/1vP/3vsf+jH//5z//zr///9I//p7pS9K7c2Y+3Qkz9ggUPgiSiICCwYJBYKIZ0tpGlv//7//98XCYYCBv9QPsNJ2xUDQKgooFAqVBQVRRZdvXa1rWJSZxGi8ePH/v//d7Pb/3GR//s9///1MP/+FP9Yf7wiDoHgaB4IAiD4eCEIQuHg8OBuOBwOA4BAeEIIg8KBMFAQFoHAqEAkAgLhSLR2JiEaDoiHAsGRP/+MYxAsV0kq0AdhgAGwmMh4ej0eEITDULhYLBdOz0T//5VBkjKnRJkRzIjcZNTNTUX/VazMzM0Mng6FQYDELhs0cFAM2nQ0BBKUB0okLATdWGGwvl///+vt///uCQbC8EwXAq3n/X9XqVe9nJVLf3h38iFgUHg4FwkHBU//+r0+teqrX2qXCwADv////zv//1/6//1f/q/7/V/KfqoICB9tY26Fhs1KRMRJRMUKBEVKBEWMRJRMwP/+MYxA8UKDKIAYdAAO0H5eXl5kxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
    audio.play();
  } catch (e) {
    console.error("Nepodařilo se přehrát zvuk:", e);
  }
};

// Zvuk pro pauzu časovače
export const playPauseSound = () => {
  try {
    // Dvojité pípnutí pro pauzu
    const audio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAcAAYGBgYGBgYGBgYGBgYGBgYGBgj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj7CwsLCwsLCwsLCwsLCwsLCwsLDf39/f39/f39/f39/f39/f39/f////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDkAAAAAAAAAHAuYKdKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/jGMQADQAaUCkBEAABVMHgGAB//3+ZfxB/EH8Qe/////+IPe973vf+/////fUYM4AAAAAAACC1f//+rWtQi3ZTMUAAACWA0GAwGBAvAAYDAYDAYDAYDAIAgEAQB/4KAQBPlfV8CAQBqolAIAn5P/nAIAn/g8AsAIDlwIAgL6qCAJ///xAEAT5cAgCB++qhQBAMgQBAXFnggCfkAQBPxiAZ/8AgCfirAQBAEAQB//pAEB/9VMQBP/BQBAUAQBFoOBAE/9VAIBAUAQBP/BQBAcCAJ/4KAQBAQBAUAQBPygCB+qg4EAT/1oOBAEAQB//+MYxBMYQ0qMAdhgAA8EAT/4ggCfkAQHAgCflAEB98AgP/AgCA+UAgCA4EAQBAEAQBAEAgCAJAgC7XxAEB///AgCfkAQFAEAQBAZAgCA5AgCA/9VDAQBP/wIAgCf/ggCA5cCAQG8dQgCc1AgCB9VPBQBAf//hAE//eIAnzVPggCf9VHArPKqEAQB/yggCflAEBQBAI9VHggCflYEAT/8CAJ/4ggCfnggCA//+MYxA0Xszq0AY9gALr4gCAJ8+gUAQH8CAJ88EAQBIEBQBAE/KA4EB8oAgP/AgCAIDgQBAU/UBQCv/KAgCAuBAEB+6ggCA/CAQBHAKTVAEAQBAbwJUAQBAXY1UgUAwBAE/8CgcAgCf/ggOf/ggCfLAgCf/AgOBAEAQG/VR8XCwQBAEAQBAEAQBAEAQBAEAQBAEAQBAQBAEAQBAEB4IBAMAQBP/BAIBAIBAIBP/+MYxA8WAAqIAY9gAAQCAQCAQCAQEAQEAQCAUAQCAUAgYBQCBwFAIDoQBAEBAEAQBAfCAICAIAgIAgIAgEAgEAgFAIBQCAQCgEAgFAIBQCAUAgFAoBAKBQCgUAgFgQBAEAQBAEAQBAEAQBAEAQBAEBAEAQBAEAQBAEAQCAQCAQCAQCAQCAICgIAgIAgIAgIAgIAgIAgIAgCAgCAQCAQCAUAgEAgFAIBQCAUAgP/+MYxBQRu0aAAY9AAAAFAIBQCAUAgFgUAgEgUAgYBAIBQCgEAgEAQBAEAQBAEAQBAEAQBAEBQBAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQP/+MYxCEAAANIAcAAABAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAAA==");
    audio.play();
  } catch (e) {
    console.error("Nepodařilo se přehrát zvuk:", e);
  }
};

// Zvuk pro dokončení časovače
export const playStopSound = () => {
  try {
    // Zvuk pro dokončení časovače
    const audio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAABAAAAeAAMDAwMDAwMDAwV1dXV1dXV1dXhYWFhYWFhYWFsrKysrKysrKy4ODg4ODg4ODg//////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAOQAAAAAAAA4aAM1DUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAANcBagIUMQAAunR8f//////XOMdDI5////6AwGA4aAwG9QGAwGAMYBgMkANYDQoA4FAAYDAYDAQBAEDgeD+f/QGAwGAwGAMAAwGAIAgCAwBAEBwPB/UBwPB4P/4QfNEBwPBgMAwGAwJQMBn///+CDoEoCgKAoGXS6XS6XS6XS6eAoBgMBgXEDK5XK5XLi4uLi4uHAMBgMCUDAhcXFy4uMuLjLi4y4uLi4uLi46OjOdJkAwMuLi5cXLi44HAwGAwKQMC4uLi4uLlxcZcXGXFxlxcZOdAcDg/+MYxBcY82qwAZhAAP//B/KA4Hg8GAwDAlAx0KS6XS6XS6eA4AYDAYFAGBIMw7IwOMHIsGJjBgZDIY0RBgdLpdLpdLoSAYDAYEgGBMMw7IwOMHGDjBxgwAYAMTGiIMDn5+fn5+fn5+fn5+fn5/K5cXLi5cXLi5cXLi5cXGXFxlxcXFxlxcdHR0dHR0dHR0dHRcXGXFxlxcZcXGXFxlxcZcX/f9cZcXHRnOkyA4HhKBgXFxcuLi4uLi4/+MYxA4XK0awAY9gAAoEBgMBgQAYELi4y4uMuLjLi4y4uMnOgMBgN/4PB//8Hg+Cv/B8Hg/lAcDweDwfEH+pXK5XK5XL/4CgGAwGAwIAMBsMBgN/4Hg//+BQMCBwUCAoHBQICgcGgUEBYPCQcEg8KB8DwQCwWCPBoR/+jlcrk6Tpd///+XS6XS6XiQGAwGA4KA4NB4Q//4aEA8HhQPCgeEg4KB9KpcXyuXFxcwMBgMBgQgYF1xcdP/+MYxA4Xe26wAYyAAPH/8uLi9cXLi4uLi5cXLi4uXFxcXF///8f/lxcXFy4uLi4uXFy4uXLi5f//+XFxcwMBgMBgQAYF1xcXFxcXNDAwGAwGBABgXXFxcXFxcXFzQwMBgMBgQAYF1xcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxc");
    audio.play();
  } catch (e) {
    console.error("Nepodařilo se přehrát zvuk:", e);
  }
};

// Modul pro zvuk dokončeného kola (25 minut)
export const playCompletedSound = () => {
  try {
    // Zvuk upozorňující na dokončení bloku 25 minut
    const audio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAABgAAAeoAHh4eHh4eHh4eHh4eHh4eHh4eOjo6Ojo6Ojo6Ojo6Ojo6Ojo6VlZWVlZWVlZWVlZWVlZWVlZWcXFxcXFxcXFxcXFxcXFxcXFxjY2NjY2NjY2NjY2NjY2NjY2NqampqampqampqampqampqampAAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAJAmQAAAAAAAB6r4mJioAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjEAAzwXJRRSxAAC4k4yDf1+v//P+v//+P+vZ9fv////v1+fz4+n5/z55vXqDYAAAAAAAHsSw////+tapcHdVIjMCAAAAAmBP/ldl1S6g7//Tj75+////8ZxvGoYXEoHAMGMOvQyXhcxQcFhIVLiYujKBwVCAgJCQsYmDE2VU5YZVhqYs7////xTVJIUkxN/+MYxCYbg+KoGYNAAYaSmJ6YqJzE+VWZmJqhoaGltctm//////NUmpSUnKSk7KysrMTU3Pz8/Pz8/P0dHR0dHR0fHx8fHx8fISEhJiYmJycnJzs7OztFRkVGUlJSUmhoZ2h3d3d3iIiIiJiYmJioqKiorKysrMzMzM3Nzc3d3d3e7u7u7vb29vf39/f+/v7+/v7+////////////////////9DQzODs+P0FCQkRGSElKTlBTVFZZXWBiZGVoam1vcnV3f/+MYxA4aeZqsAYNgAYORlJidoaaqvsDE1NTY3OTk7PkBDREVGSElKS0xNUFFSU1NUVVVWVlZYWVpbXF1eX19fYGJjZGVmZ2hpamtsb3BwcXFydHV2d3d4eHh5eXl6enp6fHx8fHx9fX1+fn5+f39/f3+Pj4+Pj5+fn5+fn6+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/P7+/v7+/v//////////////////////////////+MYxAcNwJ6gAYMAAP//////f//////1f/////////v/////+7//////3/////+//////7//////////////+3/////////+//////3/////////5///////////////////////////////////////////////////////////////////////////////////////////////////+///////////////+MYxC0QaOKoAcEYAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+MYxHIAAANIAAAAAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+MYxK4AAANIAAAAAf////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+MYxK4AAANIAAAAAf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    audio.play();
  } catch (e) {
    console.error("Nepodařilo se přehrát zvuk:", e);
  }
};