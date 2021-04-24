const Global = {
    self: this,
      setup() {
        Global.windowW = 1920 * 0.8;
        Global.windowH = Global.getWindowH(Global.windowW);
        Global.imgScale = Global.windowW / 1920;
        Global.virtualW = 1920;
        Global.virtualH = 1080;
      
        Global.app = new PIXI.Application({
          width: Global.windowW,
          height: Global.windowH,
          autoResize: true,
          resolution: devicePixelRatio,
        });
      },
      resizeHandler() {
        const scaleFactor = Math.min(
          window.innerWidth / Global.virtualW,
          window.innerHeight / Global.virtualH
        );
      
        const newWidth = Math.ceil(Global.virtualW * scaleFactor * 0.99);
        const newHeight = Math.ceil(Global.virtualH * scaleFactor * 0.99);
      
        Global.app.view.style.width = `${newWidth}px`;
        Global.app.view.style.height = `${newHeight}px`;
        Global.app.resize(newWidth, newHeight);
      },
      getWindowH(width) {
        let result = 1;
        // 1.78 or less keeps a close 16:9 aspect ratio
        while (width / result > 1.78) {
          result += 1;
        }
        return result;
      }
};

export default Global;