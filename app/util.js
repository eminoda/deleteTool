module.exports = sendToRender;
function sendToRender(event, ...sendData) {
	event.sender.send('sendToRender', ...sendData);
}
