import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { webRTCStar } from '@libp2p/webrtc-star'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT } from '@libp2p/kad-dht'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import languageResource from "./languages.json"

document.addEventListener('DOMContentLoaded', async () => {

    // Read the system language
    const lang = navigator.language
    const language = languageResource[lang] || languageResource['en-US']//English as a fallback

    const wrtcStar = webRTCStar()
    // Create our libp2p node
    const libp2p = await createLibp2p({
        dht: kadDHT(),
        addresses: {
            listen: [
                '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
                '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
            ]
        },
        transports: [
            webSockets(),
            wrtcStar.transport
        ],
        connectionEncryption: [noise()],
        streamMuxers: [yamux(), mplex()],
        peerDiscovery: [
            wrtcStar.discovery,
            kadDHT(),
            bootstrap({
                list: [
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
                ]
            })
        ],
        connectionManager: {
            maxConnections: 5,
            minConnections: 0
        },
        services: {
            pubsub: gossipsub({ emitSelf: true })
        }
    })

    libp2p.services.pubsub.subscribe(language["channel"])

    // UI elements
    const output = document.getElementById('output')
    const messageBox = document.getElementById('messageBox')
    const peerNumber = document.getElementById('peerNumber')
    const onlinePeersText = document.getElementById('onlinePeersText')
    const messagePreview = document.getElementById('messagePreview')
    const notice = document.getElementById('notice')
    messageBox.setAttribute("placeholder", language["start"])
    notice.textContent = language["notice"]
    messagePreview.textContent = language["preview-init"]
    onlinePeersText.textContent = language["online-peers"]
    output.textContent = ''

    //To log the peer status
    function log(txt) {
        console.info(txt)
    }
    //To avoid complaints about no replies
    function testPeerNumbers() {
        peerNumber.textContent = String(libp2p.services.pubsub.getSubscribers(language["channel"]).length)
        if (libp2p.services.pubsub.getSubscribers(language["channel"]).length != 0) {
            messageBox.placeholder = language["peers-found"]
            messageBox.removeAttribute("disabled")
        }
        else {
            messageBox.placeholder = language["waiting"]
            messageBox.setAttribute("disabled", "disabled")
        }
    }
    function testPeerAvailability() {
        libp2p.getConnections().forEach((conn) => {
            var isPeer = false
            libp2p.services.pubsub.getSubscribers(language["channel"]).forEach((subPeer) => {
                if (subPeer.toString() === conn.remotePeer.toString()) {
                    isPeer = true
                }
            })
            if (isPeer) {
                log(String(conn.remotePeer) + " is an yutai-teahouse peer!")
            }
            else {
                log(String(conn.remotePeer) + " is not an yutai-teahouse peer.")
                libp2p.hangUp(conn.remotePeer)
            }
        })
    }

    // Listen for new peers
    libp2p.addEventListener('peer:discovery', (evt) => {
        const peerInfo = evt.detail
        log(`Found peer ${peerInfo.id.toString()}`)

        // dial them when we discover them
        libp2p.dial(peerInfo.id).catch(err => {
            log(`Could not dial ${peerInfo.id.toString()}`, err)
            testPeerNumbers()
        })
        testPeerNumbers()
    })

    // Listen for new connections to peers, where the magic starts
    libp2p.addEventListener('peer:connect', (evt) => {
        const peerId = evt.detail
        const connections = libp2p.getConnections(evt.detail)
        log(`Connected to ${peerId.toString()}`)
        connections.forEach((conn) => {
            libp2p.services.pubsub.addPeer(conn.remotePeer, conn.stat.direction, conn.remoteAddr)
            libp2p.services.pubsub.connect(String(conn.remotePeer))
        })
        peerNumber.textContent = String(libp2p.services.pubsub.getSubscribers(language["channel"]).length)
        setTimeout(() => testPeerAvailability(), 3000)
    })

    // Listen for peers disconnecting
    libp2p.addEventListener('peer:disconnect', (evt) => {
        const peerId = evt.detail
        window.eventDisconnect = evt
        log(`Disconnected from ${peerId.toString()}`)
        libp2p.services.pubsub.removePeer(peerId)
        testPeerNumbers()
    })
    //Where it receives messages, and renders it.
    libp2p.services.pubsub.addEventListener('message', (message) => {
        const messageString = new TextDecoder().decode(message.detail.data)
        var newElement = document.createElement("div")
        var messageFrom = document.createElement("div")
        var messageContent = document.createElement("div")
        var timestamp = document.createElement("div")
        messageFrom.textContent = String(message.detail.from)
        messageFrom.className = "text-sm text-sky-600 inline-block pr-4"
        timestamp.textContent = language["posted-at"] + new Date().toLocaleTimeString()
        timestamp.className = "text-xs text-gray-500 inline-block"
        messageContent.innerHTML = DOMPurify.sanitize(marked.parse(messageString, {mangle: false, headerIds: false}))
        newElement.appendChild(messageFrom)
        newElement.appendChild(timestamp)
        newElement.appendChild(messageContent)
        newElement.className = "bg-discord-dark hover:bg-discord-grey"
        output.appendChild(newElement)
        document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight
    })
    //Where it sends messages
    function send(messageText) {
        libp2p.services.pubsub.publish(language["channel"], new TextEncoder().encode(messageText))
    }
    //That's how usual chat apps process Enter
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'Enter') {
            send(messageBox.value)
            messageBox.value = ''
        }
        messagePreview.innerHTML = DOMPurify.sanitize(marked.parse(messageBox.value, { mangle: false, headerIds: false }))
    })
    //And that's for phone users
    notice.addEventListener('click', () => {
        send(messageBox.value)
        messageBox.value = ''
        messagePreview.innerHTML = DOMPurify.sanitize(marked.parse(messageBox.value, { mangle: false, headerIds: false }))
    })
    //Detect the change of the message box more precisely
    messageBox.addEventListener('keyup', () => {
        messagePreview.innerHTML = DOMPurify.sanitize(marked.parse(messageBox.value, { mangle: false, headerIds: false }))
    })
    messageBox.addEventListener('change', () => {
        messagePreview.innerHTML = DOMPurify.sanitize(marked.parse(messageBox.value, { mangle: false, headerIds: false }))
    })
    messageBox.addEventListener("input", () => {
        messagePreview.innerHTML = DOMPurify.sanitize(marked.parse(messageBox.value, { mangle: false, headerIds: false }))
    })
    //To avoid residual connections when closing the window
    window.addEventListener('beforeunload', function () {
        libp2p.getConnections().forEach((conn) => {
            libp2p.hangUp(conn.remotePeer)
        })
    })
    messageBox.placeholder = language["waiting"]
    log(`libp2p id is ${libp2p.peerId.toString()}`)
    setInterval(testPeerNumbers, 1000)
    //For debug
    //window.libp2p = libp2p
})