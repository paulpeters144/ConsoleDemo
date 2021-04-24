import Global from '../Global.js'
import Node from './Node.js'

class TheShell {
    constructor(helperShellImg, mainShellImg, infoShellImg, prefix, cmdTree) {
        this.Prefix = prefix;
        const yOffset = 10;
        this.Img = mainShellImg;
        
        this.textStyle = new PIXI.TextStyle({
            fontFamily: 'consolas',
            fontSize: 24,
            fill: '#00ff00',
            stroke: '#00ff00',
            wordWrap: true,
            wordWrapWidth: 525,
        });

        this.HelperShell = new HelperShell(helperShellImg, this.textStyle, cmdTree);
        this.InfoShell = new InfoShell(infoShellImg, this.textStyle);
        this.CommandTree = this.createTreeFrom(cmdTree);
        
        this.container = new PIXI.Container();
        this.container.addChild(this.InfoShell.Img);
        this.container.addChild(this.InfoShell.PixiText);
        this.container.addChild(this.Img);
        this.container.addChild(this.HelperShell.Img);
        this.container.addChild(this.HelperShell.PixiText);

        this.InfoShell.ChangeCordinates(0, yOffset);
        this.InfoShell.Img.y = yOffset;
        this.Img.x = this.InfoShell.Img.x + this.InfoShell.Img.width;
        this.HelperShell.ChangeCordinates(this.Img.x + this.Img.width, yOffset);
        this.Img.y = yOffset;
        this.HelperShell.Img.y = yOffset;
        this.HelperShell.Handle('', this.CommandTree);

        this.loadKeyDictoinaries();

        this.commandHistory = [];
        this.CmdIdx = 0;

        const theShell = this;
        document.addEventListener('keydown', function(event) {
            theShell.keyDownHandler(event);
        });

        document.addEventListener('keyup', function(event) {
            theShell.keyUpHandler(event);
        });

        this.boardText = new PIXI.Text(this.Prefix + '_', this.textStyle);
        this.boardText.x = this.Img.x + 25;
        this.boardText.y = this.Img.y + this.Img.height - 50;

        this.cmdHistoryText = new PIXI.Text('', this.textStyle);
        this.cmdHistoryText.x = this.boardText.x;
        this.cmdHistoryText.y = this.boardText.y;

        const shellWidth =
            this.InfoShell.Img.width +
            this.Img.width +
            this.HelperShell.Img.width;

        this.container.x = (Global.virtualW - shellWidth) / 2;
        this.container.addChild(this.boardText);
        this.container.addChild(this.cmdHistoryText);
    }

    createTreeFrom(cmdTree){
        let result = new Node('','');
        Object.keys(cmdTree).forEach((e) => {
            const branch = e.split(' ');
            const action = cmdTree[e];
            result.CreateBranch(branch, action);
          });
        return result;
    }

    keyDownHandler(event) {

        if (this.enteredValidKey(event)) {
            this.performActionFor(event);
        } else if (backspacePressed(event)) {
            this.backSpace();
        } else if (enterPressed(event)) {
            this.enterCommand();
        } else if (upArrowPressed(event)){
            this.incrementCmdHistory();
        } else if (downArrayPressed(event)){
            this.decrementCmdHistory();
        }

        this.handleHelperShell();
        this.handleInfoShell();

        if (this.KeysPressed.hasOwnProperty(event.keyCode))
            this.KeysPressed[event.keyCode] = true;
    }

    handleHelperShell(){
        const userCommand = this.boardText.text.slice(0, -1).slice(this.Prefix.length);
        this.HelperShell.Handle(userCommand, this.CommandTree);
    }

    handleInfoShell(){
        
    }

    backSpace(){
        if (this.boardText.text.length > this.Prefix.length) {
            this.boardText.text = this.boardText.text.slice(0, -2).slice(this.Prefix.length);
            this.boardText.text = `${this.Prefix}${this.boardText.text}_`;
        }
    }

    performActionFor(event){
        if (this.boardText.width > this.Img.width - 65) {
            return;
        } 
        let key = this.CharCodes[event.keyCode];
        if (this.KeysPressed[16] === true){
            if (this.ToUpper.hasOwnProperty(key)){
                key = this.ToUpper[key];
            }
        } 
        this.boardText.text = this.boardText.text.slice(0, -1).slice(this.Prefix.length);
        this.boardText.text = `${this.Prefix}${this.boardText.text}${key}_`;
    }

    enteredValidKey(event){
        return this.CharCodes.hasOwnProperty(event.keyCode);
    }

    enterCommand(){
        const userCommand = this.boardText.text.slice(0, -1).slice(this.Prefix.length);
        this.InfoShell.LookForPossibleCmd(userCommand, this.CommandTree);
        this.addCommandToHistory();
    }
    addCommandToHistory(){
        
        let commandEntered = this.boardText.text.slice(0, -1).slice(this.Prefix.length);
        if (commandEntered === "") return;
        if (this.commandHistory.length > 8) this.commandHistory.shift();
        this.commandHistory.push(commandEntered);
        this.cmdHistoryText.text = "";
        this.boardText.text = `${this.Prefix}_`;
        this.cmdHistoryText.y = this.boardText.y;
        const lineHeight = this.boardText.height;
        for (let i = 0; i < this.commandHistory.length; i++) {
            this.cmdHistoryText.y -= lineHeight;
            this.cmdHistoryText.text += `${this.Prefix}${this.commandHistory[i]}\n`;
        }
        this.CmdIdx = 0;
    }
    incrementCmdHistory(){
        if (this.CmdIdx === 0) {
            this.CmdIdx = this.commandHistory.length - 1;
        } else {
            this.CmdIdx--;
        }
        this.boardText.text = this.Prefix + this.commandHistory[this.CmdIdx] + "_";
    }

    decrementCmdHistory(){
        if (this.CmdIdx === this.commandHistory.length - 1)
            this.CmdIdx = 0;
        else this.CmdIdx++;
        this.boardText.text = this.Prefix + this.commandHistory[this.CmdIdx] + "_";
    }

    keyUpHandler(event) {
        if (this.KeysPressed.hasOwnProperty(event.keyCode))
            this.KeysPressed[event.keyCode] = false;
    }

    loadKeyDictoinaries() {
        this.CharCodes = {
                32: ' ',
                48: '0',
                49: '1',
                50: '2',
                51: '3',
                52: '4',
                53: '5',
                54: '6',
                55: '7',
                56: '8',
                57: '9',
                65: 'a',
                66: 'b',
                67: 'c',
                68: 'd',
                69: 'e',
                70: 'f',
                71: 'g',
                72: 'h',
                73: 'i',
                74: 'j',
                75: 'k',
                76: 'l',
                77: 'm',
                78: 'n',
                79: 'o',
                80: 'p',
                81: 'q',
                82: 'r',
                83: 's',
                84: 't',
                85: 'u',
                86: 'v',
                87: 'w',
                88: 'x',
                89: 'y',
                90: 'z',
                188: ',',
                189: '-',
                190: '.',
                191: '/',
            },

            this.ToUpper = {
                '0': ')',
                '1': '!',
                '2': '@',
                '3': '#',
                '4': '$',
                '5': '%',
                '6': '^',
                '7': '&',
                '8': '*',
                '9': '(',
                'a': 'A',
                'b': 'B',
                'c': 'C',
                'd': 'D',
                'e': 'E',
                'f': 'F',
                'g': 'G',
                'h': 'H',
                'i': 'I',
                'j': 'J',
                'k': 'K',
                'l': 'L',
                'm': 'M',
                'n': 'N',
                'o': 'O',
                'p': 'P',
                'q': 'Q',
                'r': 'R',
                's': 'S',
                't': 'T',
                'u': 'U',
                'v': 'V',
                'w': 'W',
                'x': 'X',
                'y': 'Y',
                'z': 'Z',
                '/': '?',
                ',': '<',
                '.': '>',
                ' ': ' ',
                '-': '-',
            },

            this.KeysPressed = {
                8: false,
                16: false
            }
    }
}

function backspacePressed(event){
    return event.keyCode === 8;
}

function enterPressed(event){
    return event.keyCode === 13;
}

function upArrowPressed(event){
    return event.keyCode === 38;
}

function downArrayPressed(event){
    return event.keyCode === 40;
}

class HelperShell{
    constructor(img, textStyle, cmdTree){
        this.Img = img;
        this.PixiText = new PIXI.Text('', textStyle);
        this.CommandTree = cmdTree;
        this.Lines = [];
    }
    ChangeCordinates(xCord, yCord){
        this.Img.x = xCord;
        this.Img.y = yCord;
        this.BaseX = this.Img.x + 25;
        this.BaseY = this.Img.y + this.Img.height - 50;
        this.PixiText.x = this.BaseX;
        this.PixiText.y = this.BaseY;
    }
    Handle(userCommand, cmdTree){
        const userCmdArr = userCommand.split(' ');
        this.Lines = [];
        let currnetNode = cmdTree;
        let searchIdx = 0;
        while (true){
            const cmdSearch = userCmdArr[searchIdx];
            for (let i = 0; i < currnetNode.Children.length; i++) {
                const nodeCmd = currnetNode.Children[i].ShortCmd;
                if (cmdSearch === nodeCmd)
                    currnetNode = currnetNode.Children[i];
            }
            searchIdx++
            if (searchIdx >= userCmdArr.length) break;
        }
        for (let i = 0; i < currnetNode.Children.length; i++) {
            const mainCmd = currnetNode.Children[i].MainCmd;
            const shortCmd = currnetNode.Children[i].ShortCmd;
            this.Lines.push(`${mainCmd} [${shortCmd}]`);
        }
        if (this.Lines.length === 0){
            this.showEnterCommand();
        } else {
            this.drawLines();
        }
    }
    showEnterCommand(){
        this.PixiText.text = "COMMAND READY";
        this.PixiText.x = this.Img.x + ((this.Img.width - this.PixiText.width) / 2);
        this.PixiText.y = this.Img.y + ((this.Img.height - this.PixiText.height)) / 2;
    }
    drawLines(){
        this.PixiText.y = this.BaseY;
        this.PixiText.x = this.BaseX;
        this.PixiText.text = '';
        const textHeight = this.PixiText.height;
        for (let i = 0; i < this.Lines.length; i++) {
            this.PixiText.text += this.Lines[i] + '\n';
            this.PixiText.y -= textHeight;
        }
        this.PixiText.y += textHeight;
    }
}

class InfoShell{
    constructor(img, textStyle){
        this.Img = img;
        this.PixiText = new PIXI.Text('', textStyle);
    }
    ChangeCordinates(xCord, yCord){
        this.Img.x = xCord;
        this.Img.y = yCord;
        this.BaseX = this.Img.x + 25;
        this.BaseY = this.Img.y + this.Img.height - 50;
        this.PixiText.x = this.BaseX;
        this.PixiText.y = this.BaseY;
    }
    LookForPossibleCmd(userCommand, cmdTree){
        const userCmdArr = userCommand.split(' ');
        this.Lines = [];
        let currnetNode = cmdTree;
        let searchIdx = 0;
        while (true){
            const cmdSearch = userCmdArr[searchIdx];
            for (let i = 0; i < currnetNode.Children.length; i++) {
                const nodeCmd = currnetNode.Children[i].ShortCmd;
                if (cmdSearch === nodeCmd)
                    currnetNode = currnetNode.Children[i];
            }
            searchIdx++
            if (searchIdx >= userCmdArr.length) break;
        }
        if (currnetNode.Action !== null){
            this.PixiText.text = currnetNode.Action();
        }
    }
}

export default TheShell