// Libp2p modules
import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { webRTCStar } from '@libp2p/webrtc-star'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT } from '@libp2p/kad-dht'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
// Markdown modules
import { marked } from 'marked'
import { markedEmoji } from "marked-emoji"
import DOMPurify from 'isomorphic-dompurify'
import languageResource from "./languages.json"
// Emoji modules
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'
import emojiResource from "./emojis.json"

document.addEventListener('DOMContentLoaded', async () => {

    // Read the system language if not set
    if (!localStorage["language"]) { 
        localStorage.setItem("language", navigator.language)
    }
    const lang = localStorage["language"]
    document.getElementsByTagName("html")[0].setAttribute("lang", lang)//To avoid the annoying translation popup
    const language = languageResource[lang] || languageResource['en-US']//English as a fallback
    document.getElementsByTagName("title")[0].innerText = language["title"]

    // UI elements
    const output = document.getElementById('output')
    const messageBox = document.getElementById('messageBox')
    const peerNumber = document.getElementById('peerNumber')
    const onlinePeersText = document.getElementById('onlinePeersText')
    const messagePreview = document.getElementById('messagePreview')
    const notice = document.getElementById('notice')
    const emojiButton = document.getElementById('emojiButton')
    messageBox.setAttribute("data-placeholder", language["start"])
    notice.textContent = language["notice"]
    messagePreview.setAttribute("data-palceholder", language["preview-init"])
    onlinePeersText.textContent = language["online-peers"]
    output.textContent = ''

    //Set up language selection
    const languageSelect = document.getElementById('languageSelect')
    for (const [key, value] of Object.entries(languageResource)) {
        const option = document.createElement("option")
        option.value = key
        option.text = value["lang_name"]
        option.className = "absolute right-0 z-10 mt-2 w-56 text-black origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        if (key == lang) {
            option.setAttribute("selected", "selected")
        }
        languageSelect.appendChild(option)
    }
    //Detect user selection of language
    languageSelect.addEventListener('change', () => {
        localStorage.setItem("language", languageSelect.value)
        location.reload()
    })
    // Load emoji resources
    // As the usage of Github is not stable in China,
    // here we use a local copy of https://api.github.com/emojis.
    const emojiOptions = {
        unicode: false,
        emojis: emojiResource,
    }
    const EmojiExtension = markedEmoji(emojiOptions)
    EmojiExtension.extensions[0].renderer = function (token) {
        if (token.unicode) {
            return token.emoji;
        } else {
            return `<img class="w-6 inline" alt="${token.name}" src="${token.emoji}"${this.parser.options.xhtml ? ' /' : ''}>`;
        }
    }
    marked.use(EmojiExtension)
    // Create our libp2p node
    const wrtcStar = webRTCStar()
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


    //To log the peer status
    function log(txt) {
        console.info(txt)
    }
    //To avoid complaints about no replies
    function testPeerNumbers() {
        peerNumber.textContent = String(libp2p.services.pubsub.getSubscribers(language["channel"]).length)
        if (libp2p.services.pubsub.getSubscribers(language["channel"]).length != 0) {
            messageBox.setAttribute("data-placeholder",language["peers-found"])
            messageBox.setAttribute("contenteditable",true)
        }
        else {
            messageBox.setAttribute("data-placeholder",language["waiting"])
            messageBox.setAttribute("contenteditable", false)
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
            send(messageBox.innerText)
            messageBox.innerText = ''
        }
        messagePreview.innerHTML = DOMPurify.sanitize(marked.parse(messageBox.innerText, { mangle: false, headerIds: false }))
    })
    //And that's for phone users
    notice.addEventListener('click', () => {
        send(messageBox.innerText)
        messageBox.innerText = ''
        messagePreview.innerHTML = DOMPurify.sanitize(marked.parse(messageBox.innerText, { mangle: false, headerIds: false }))
    })
    //Detect the change of the message box more precisely
    messageBox.addEventListener('keyup', () => {
        messagePreview.innerHTML = DOMPurify.sanitize(marked.parse(messageBox.innerText, { mangle: false, headerIds: false }))
    })
    messageBox.addEventListener("input", () => {
        messagePreview.innerHTML = DOMPurify.sanitize(marked.parse(messageBox.innerText, { mangle: false, headerIds: false }))
    })
    //To avoid residual connections when closing the window
    window.addEventListener('beforeunload', function () {
        libp2p.getConnections().forEach((conn) => {
            libp2p.hangUp(conn.remotePeer)
        })
    })
    const pickerOptions = {
        data,
        onEmojiSelect: (emoji) => {
            messageBox.innerText += emoji.shortcodes
            messagePreview.innerHTML = DOMPurify.sanitize(marked.parse(messageBox.innerText, { mangle: false, headerIds: false }))
        }
    }

    
    //config the emoji picker
    const emojiPicker = new Picker(pickerOptions)
    emojiPicker.className = "fixed top-0 right-0 hidden"
    document.getElementsByTagName("body")[0].appendChild(emojiPicker)

    //Reponsive emoji button
    emojiButton.addEventListener('click', () => {
        emojiPicker.classList.toggle("hidden")
    })
    messageBox.setAttribute("data-placeholder",language["waiting"])
    log(`libp2p id is ${libp2p.peerId.toString()}`)
    setInterval(testPeerNumbers, 1000)
    //For debug
    //window.libp2p = libp2p
})
