// import WebSocket from 'ws';
const WebSocket = require('ws');


const ws = new WebSocket('ws://localhost:8080');
const ws2 = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
	ws.send(JSON.stringify({
		command: 'create',
		channelName: 'test',
		userName: 'jan'
	}))
	setTimeout(() => {
		ws.send(JSON.stringify({
			command: 'send',
			channelName: 'test',
			userName: 'jan',
			message: 'Treść wiadomości'
		}))
	}, 1000)

	setTimeout(() => {
		ws.send(JSON.stringify({
			command: 'leave',
			channelName: 'test',
			userName: 'jan',
		}))
	}, 2000)
	
	setTimeout(() => {
		ws.send(JSON.stringify({
			command: 'create',
			channelName: 'test',
			userName: 'jan',
		}))
	}, 2500)
	setTimeout(() => {
		ws.send(JSON.stringify({
			command: 'send',
			channelName: 'test',
			userName: 'jan',
			message: 'Treść wiadomości'
		}))
	}, 3000)
	
})

ws.on('message', (data) => {
	console.log('received [jan]: ', data.toString())
})


ws2.on('open', () => {
	ws2.send(JSON.stringify({
		command: 'create',
		channelName: 'test',
		userName: 'jan2'
	}))
	setTimeout(() => {
		ws.send(JSON.stringify({
			command: 'send',
			channelName: 'test',
			userName: 'jan2',
			message: 'Treść wiadomości drugiej'
		}))
	}, 1500)
})

ws2.on('message', (data) => {
	console.log('received [jan2]: ', data.toString())
})
