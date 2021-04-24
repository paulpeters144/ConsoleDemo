import Test from './mess.js'
import Global from './Global.js'

const State = {
    GAME: 1
  };

  const startingState = State.GAME;
  
  function gameEngine(location) {
    Global.location = location;
    switch (location) {
      case State.GAME:
        Test.start();
        break;
    }
  }
  
  function initGame() {
    Global.setup();
    // Global.app.renderer.plugins.interaction.cursorStyles.pointer = "none";
    // Global.app.renderer.plugins.interaction.cursorStyles.default = "none";
    document.body.appendChild(Global.app.view);
    window.addEventListener('resize', Global.resizeHandler, false);
    Global.resizeHandler();
  }

  window.onload = function onLoad() {
    initGame();
    gameEngine(startingState);
  };