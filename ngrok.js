const ngrok = require('@ngrok/ngrok');

async function forwardToApp() {
    try {
        const forwarder = await ngrok.forward({
            addr: 'localhost:3000',
            authtoken_from_env: true,
            domain: 'spud-overfed-promptly.ngrok-free.dev'
        });

        console.log(`NGROK: ${forwarder.url()}`);
    } catch (error) {
        console.error('NGROK ERROR:', error);
    }
}

forwardToApp();