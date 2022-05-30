// import WebSocket from 'ws';
const WebSocket = require('ws');


const wss = new WebSocket.Server({
	port: 8080,
});

let db = {}

class ChatUser {
	constructor(name, ws) {
		this.ws = ws
		this.name = name
	}

	static sendMessage(ws, message) {
		ws.send(message)
	}
}

class Channel {
	constructor(name) {
		this.name = name
		this.users = []
	}

	channelStatus() {
		console.log(`Name: ${this.name}, users: ${this.users.map((u) => { return u.name }).join(', ')}`)
	}

	addUser(user) {
		if (this.users.indexOf(user) < 0) {
			this.users.push(user)
			this.sendMessage(user.name, `${user.name} joined channel`)
		}
	}

	removeUser(userName) {
		db[this.name].users = db[this.name].users.filter((user) => {
			return user.name != userName
		})
		this.sendMessage(null, `${userName} left channel`)
	}

	sendMessage(from, message) {
		db[this.name].users.forEach((client) => {
			if (from != client.name && client.ws.readyState === WebSocket.OPEN) {
				client.ws.send(message, (e) => {
					if (e) {
						console.log(`e: ${e}`)
					}
				});
			}
		})
	}

	static getCannel(channelName) {
		if(db.hasOwnProperty(channelName)) {
			return db[channelName]
		} else {
			return null
		}
	}

	static createChannel(name) {
		if (!db.hasOwnProperty(name)) {
			let c = new Channel(name)
			db[name] = c
			return c
		} else {
			return db[name]
		}
	}
}

wss.on('connection', (ws) => {
	ws.on('message', (data) => {
		// console.log(JSON.parse(data.toString()))
		try {
			data = JSON.parse(data.toString())
		} catch (e) {
			ChatUser.sendMessage(ws, 'Wrong data')
			return
		}
		if (!data.hasOwnProperty('command')) {
			ChatUser.sendMessage(ws, 'Wrong command')
			return
		}
		switch (data.command) {
			case 'create':
				let createdChannel = Channel.createChannel(data.channelName)
				createdChannel.addUser(new ChatUser(data.userName, ws))
				createdChannel.channelStatus()
				break
			case 'send':
				let sendChannel = Channel.getCannel(data.channelName)
				if (sendChannel) {
					sendChannel.sendMessage(data.userName, data.message)
				}
				break
			case 'leave':
				let leaveChannel = Channel.getCannel(data.channelName)
				if (leaveChannel) {
					leaveChannel.removeUser(data.userName)
					leaveChannel.channelStatus()
				}
				break
			default:
				console.log('not found')
		}
	});
});