class Node{
	constructor(mainCmd, shortCmd){
		this.MainCmd = mainCmd;
		this.ShortCmd = shortCmd;
		this.Action = null;
		this.Children = [];
	}
	InvokeCommand(cmdSignature){
		const cmdArray = cmdSignature.split(' ');
		let currentNode = this;
		for (let i = 0; i < cmdArray.length; i++){
			const nextNode = currentNode.getChildNodeFrom(cmdArray[i]);
			if (nextNode === null) break;
			if (nextNode.Action === null) currentNode = nextNode;
			else nextNode.Action();
		}
	}
	CreateBranch(commands, action){
		let currentNode = this;
		
		for (let i = 0; i < commands.length; i++){
			const commandArr = commands[i].split(',');
			const mainCmd = commandArr[0];
			const shortCmd = commandArr[1];

			const childNode = currentNode.getChildNodeFrom(mainCmd);
			if (childNode === null) {
				const newChild = new Node(mainCmd, shortCmd);
				currentNode.Children.push(newChild);
				currentNode = newChild;
			} else {
				currentNode = childNode;
			}
			
		}
		currentNode.Action = action;
	}
	getChildNodeFrom(mainCmd){
		for (let i = 0; i < this.Children.length; i++){
			if (this.Children[i].MainCmd === mainCmd) {
				return this.Children[i];
			}
		}
		return null;
	}
}

export default Node