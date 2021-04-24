import Global from './Global.js'
import TheShell from './utils/TheShell.js'

const cmdTree = {
  "cybo,cb bomake,bo build,bd": buildingBomake,
  "cybo,cb bomake,bo move,mv": bomakeMoved,
  "cybo,cb bomake,bo attack,ak": attacking,
  "cybo,cb bomake,bo ability,ab replicate,rp": replicate
};

function buildingBomake(){
  return "Building Bomake";
}
function bomakeMoved(){
  return "Bomake Moved";
}
function attacking(){
  return "Attacking";
}
function replicate(){
  return "Replicate";
}

const Test = {
    Background: null,
    container: null,
    Loader: null,
    self: this,
    KeysPressed: {},
    CharCodes: {},
    TheShell: null,

    start() {
      Test.container = new PIXI.Container();
      Global.app.stage.addChild(Test.container);
      Test.Loader = new PIXI.Loader();
      Test.Loader.baseUrl = 'Images/';
      Test.Loader.add('openingBack', 'Battleback1.png')
      .add('mainShell','CenterShell_Black.png')
      .add('utilShell','UtilShell_Black.png');
      Test.Loader.onProgress.add(Test.showProgress);
      Test.Loader.onComplete.add(Test.doneLoading);
      Test.Loader.onError.add(Test.reportError);
      Test.Loader.load();
    },
    
    showProgress(e) {
      console.log(e.progress);  
    },
    
    reportError(e) {
      console.log('Error: ', e.message);
    },

    initOpenScreenLoop() {
        console.log('DONE LOADING!!');

        Test.Background = PIXI.Sprite.from(Test.Loader.resources.openingBack.texture);
        Test.container.addChild(Test.Background);

        Test.TheShell = new TheShell(
            PIXI.Sprite.from(Test.Loader.resources.utilShell.texture),
            PIXI.Sprite.from(Test.Loader.resources.mainShell.texture),
            PIXI.Sprite.from(Test.Loader.resources.utilShell.texture),
            "cmd>",
            cmdTree
        );

        Test.container.addChild(Test.TheShell.container);
        Test.container.scale.set(Global.imgScale, Global.imgScale);
    },

    doneLoading(e) {
      Test.initOpenScreenLoop();
    },
  };

  export default Test;